package se.hangagbg.android;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.job.JobParameters;
import android.app.job.JobService;
import android.content.Intent;
import android.content.SharedPreferences;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.net.ssl.HttpsURLConnection;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.Future;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;

public final class AlertsJob extends JobService {
    static final String STORAGE = "device-alerts";
    static final String CHANNEL = "hangagbg_updates";
    static final int JOB_ID = 120;
    static final String OPEN_EVENT = "open_event";
    static final String OPEN_CHAT = "open_chat";
    static final String OPEN_SECTION = "open_section";
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private Future<?> work;

    @Override public boolean onStartJob(JobParameters parameters) {
        work = executor.submit(() -> {
            boolean retry = false;
            try { poll(); }
            catch (Exception error) { retry = true; }
            boolean reschedule = retry;
            if (!Thread.currentThread().isInterrupted()) {
                new android.os.Handler(getMainLooper()).post(() -> jobFinished(parameters, reschedule));
            }
        });
        return true;
    }

    @Override public boolean onStopJob(JobParameters parameters) {
        if (work != null) work.cancel(true);
        return true;
    }

    @Override public void onDestroy() {
        executor.shutdownNow();
        super.onDestroy();
    }

    private void poll() throws Exception {
        SharedPreferences preferences = getSharedPreferences(STORAGE, MODE_PRIVATE);
        String token = preferences.getString("token", "");
        String origin = preferences.getString("origin", "");
        if (token.isEmpty() || !origin.matches("https://(?:[a-z0-9-]+\\.){2}workers\\.dev")) return;
        long cursor = preferences.getLong("cursor", 0);
        JSONObject body = new JSONObject().put("token", token).put("after_id", cursor);
        JSONArray results = post(origin + "/alerts", body);
        if (results == null) {
            if (token.equals(preferences.getString("token", ""))) {
                preferences.edit().clear().apply();
                getSystemService(android.app.job.JobScheduler.class).cancel(JOB_ID);
            }
            return;
        }
        NotificationManager notifications = getSystemService(NotificationManager.class);
        boolean english = "en".equals(preferences.getString("language", "sv"));
        notifications.createNotificationChannel(new NotificationChannel(CHANNEL,
                english ? "Hänga Gbg updates" : "Hänga Gbg-aviseringar", NotificationManager.IMPORTANCE_DEFAULT));
        for (int i = 0; i < results.length(); i++) {
            if (Thread.currentThread().isInterrupted() || !token.equals(preferences.getString("token",""))) return;
            JSONObject alert = results.getJSONObject(i);
            long id = alert.getLong("id");
            long eventId = alert.getLong("event_id");
            String kind = alert.getString("kind");
            if ("removed".equals(kind)) ReminderReceiver.cancelEvent(this,eventId);
            if ("reminder".equals(kind) || "removed".equals(kind) || "message_skipped".equals(kind)) {
                cursor = id;
                continue;
            }
            if ("cancelled".equals(kind)) ReminderReceiver.cancelEvent(this,eventId);
            long peer = "message".equals(kind) ? alert.optLong("sender_id", -1) : 0;
            if (peer>0 && preferences.getLong("owner",0)>0) {
                ChatNotifications.show(this,preferences.getLong("owner",0),peer,id);
            } else {
                notifyEvent(notifications, Long.hashCode(id), eventId, peer, alert.getString("title"), label(kind,english), "group".equals(kind)?"group":"feedback".equals(kind)?"feedback":"again".equals(kind)?"again":("friendRequest".equals(kind)||"friendAccepted".equals(kind))?"friends":"");
            }
            cursor = id;
        }
        if (token.equals(preferences.getString("token",""))) {
            preferences.edit().putLong("cursor",cursor).apply();
            pollNeighborhood(origin, token, preferences, notifications, english);
        }
    }

    private void pollNeighborhood(String origin, String token, SharedPreferences preferences,
                                  NotificationManager notifications, boolean english) throws Exception {
        String area = preferences.getString("area", "");
        long owner = preferences.getLong("owner", 0);
        if (area.trim().isEmpty() || owner <= 0 || !notifications.areNotificationsEnabled()) return;
        long seen = preferences.getLong("seenEvent", -1);
        JSONArray events = post(origin + "/rpc", new JSONObject().put("action", "events"));
        if (events == null) throw new java.io.IOException("Meetups unavailable");
        long newest = seen;
        for (int i = 0; i < events.length(); i++) {
            if (Thread.currentThread().isInterrupted() || !token.equals(preferences.getString("token",""))
                || !area.equals(preferences.getString("area",""))) return;
            JSONObject event = events.getJSONObject(i);
            long id = event.getLong("id");
            newest = Math.max(newest, id);
            if (seen < 0 || id <= seen || event.getLong("owner") == owner || event.optBoolean("hidden")
                || event.optBoolean("cancelled") || !NeighborhoodAlerts.matches(area,event.optString("area"),event.optString("start"))) continue;
            int tag = Long.hashCode(id) ^ Integer.MIN_VALUE;
            notifyEvent(notifications, tag, id, 0, event.getString("title"),
                (english ? "New meetup in your area · " + area : "Ny träff i ditt område · " + area),"");
        }
        if (token.equals(preferences.getString("token","")) && area.equals(preferences.getString("area",""))) {
            preferences.edit().putLong("seenEvent",Math.max(0, newest)).apply();
        }
    }

    private void notifyEvent(NotificationManager notifications, int tag, long eventId, long peer, String title, String text, String section) {
        Intent open = new Intent(this, MainActivity.class).putExtra(OPEN_EVENT, eventId).putExtra(OPEN_CHAT, peer).putExtra(OPEN_SECTION,section)
            .addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent intent = PendingIntent.getActivity(this, tag, open,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        Notification notification = new Notification.Builder(this, CHANNEL)
            .setSmallIcon(R.drawable.notification_icon)
            .setContentTitle(title)
            .setContentText(text)
            .setVisibility(Notification.VISIBILITY_PRIVATE)
            .setOnlyAlertOnce(true)
            .setContentIntent(intent).setAutoCancel(true).build();
        if (notifications.areNotificationsEnabled()) notifications.notify(tag, notification);
    }

    private JSONArray post(String url, JSONObject body) throws Exception {
        HttpsURLConnection connection = (HttpsURLConnection) new URL(url).openConnection();
        try {
            connection.setInstanceFollowRedirects(false);
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(10000);
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);
            try (var output = connection.getOutputStream()) {
                output.write(body.toString().getBytes(StandardCharsets.UTF_8));
            }
            int status = connection.getResponseCode();
            if (status == 403) return null;
            if (status != 200) throw new java.io.IOException("Alerts unavailable");
            try (var reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
                StringBuilder json = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) json.append(line);
                return new JSONArray(json.toString());
            }
        } finally {
            connection.disconnect();
        }
    }

    private String label(String kind, boolean english) {
        return switch (kind) {
            case "friendRequest" -> english ? "New friend request" : "Ny vänförfrågan";
            case "friendAccepted" -> english ? "Friend request accepted" : "Vänförfrågan accepterad";
            case "again" -> english ? "You both want to meet again" : "Ni vill båda ses igen";
            case "proposalReady" -> english ? "Enough people are interested – confirm attendance" : "Tillräckligt många är intresserade – bekräfta";
            case "proposalActive" -> english ? "The meetup is confirmed" : "Nu blir träffen av";
            case "group" -> english ? "New group chat message" : "Nytt meddelande i gruppchatten";
            case "attendance" -> english ? "Confirm your attendance" : "Bekräfta att du kommer";
            case "feedback" -> english ? "How was your meetup?" : "Hur var träffen?";
            case "following" -> english ? "New meetup from an organizer you follow" : "Ny träff från en arrangör du följer";
            case "joined" -> english ? "Someone joined your meetup" : "Någon har anmält sig";
            case "vacancy" -> english ? "A spot opened up" : "En plats har blivit ledig";
            case "reminder" -> english ? "Your meetup starts within an hour" : "Träffen börjar inom en timme";
            case "changed" -> english ? "Time or place changed" : "Tid eller plats har ändrats";
            case "cancelled" -> english ? "Meetup cancelled" : "Träffen är inställd";
            default -> english ? "New message" : "Nytt meddelande";
        };
    }
}
