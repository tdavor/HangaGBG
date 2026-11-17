package se.hangagbg.android;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public final class ReminderReceiver extends BroadcastReceiver {
    private static final String CHANNEL = "hanga_event_reminders";
    private static final String FIRE = "se.hangagbg.android.FIRE_REMINDER";

    private static SharedPreferences store(Context context) {
        return context.getSharedPreferences("event-reminders", Context.MODE_PRIVATE);
    }

    private static JSONObject schedules(Context context) {
        try { return new JSONObject(store(context).getString("items", "{}")); }
        catch (JSONException ignored) { return new JSONObject(); }
    }

    private static PendingIntent alarm(Context context, String id) {
        Intent intent = new Intent(context, ReminderReceiver.class).setAction(FIRE)
            .setData(Uri.parse("hanga-reminder://event/" + id));
        return PendingIntent.getBroadcast(context, 0, intent,
            PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
    }

    private static void schedule(Context context, String id, JSONObject item) {
        long now = System.currentTimeMillis();
        if (item.optBoolean("delivered") || item.optLong("start") <= now) return;
        AlarmManager manager = context.getSystemService(AlarmManager.class);
        long when = Math.max(item.optLong("at"), now + 1000);
        PendingIntent trigger = alarm(context,id);
        if (Build.VERSION.SDK_INT < 31 || manager.canScheduleExactAlarms()) {
            try {
                manager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,when,trigger);
                return;
            } catch (SecurityException ignored) {
                // Access may have been revoked after the permission check.
            }
        }
        manager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,when,trigger);
    }

    static synchronized void sync(Context context, String json, String scope, boolean english) {
        if (json == null || json.length() > 500000 || scope == null || scope.length() > 180) return;
        JSONObject old = schedules(context);
        JSONObject next = new JSONObject();
        SharedPreferences settings = store(context);
        boolean sameAccount = scope.equals(settings.getString("scope",""));
        long now = System.currentTimeMillis();
        try {
            JSONArray entries = new JSONArray(json);
            for (int i=0; i<entries.length(); i++) {
                JSONObject item = entries.getJSONObject(i);
                long id = item.getLong("id");
                long start = item.getLong("start");
                long at = item.getLong("at");
                if (id <= 0 || start <= now || at >= start) continue;
                String key = Long.toString(id);
                JSONObject previous = sameAccount ? old.optJSONObject(key) : null;
                if (previous != null && previous.optLong("start")==start && previous.optLong("at")==at) {
                    item.put("delivered",previous.optBoolean("delivered"));
                }
                next.put(key,item);
            }
        } catch (JSONException ignored) { return; }
        AlarmManager manager = context.getSystemService(AlarmManager.class);
        for (var keys=old.keys(); keys.hasNext();) {
            String id = keys.next();
            if (!sameAccount || !next.has(id)) {
                manager.cancel(alarm(context,id));
                context.getSystemService(NotificationManager.class).cancel(id,1);
            }
        }
        settings.edit().putString("items",next.toString()).putString("scope",scope)
            .putBoolean("english",english).apply();
        for (var keys=next.keys(); keys.hasNext();) {
            String id=keys.next();
            schedule(context,id,next.optJSONObject(id));
        }
    }

    static synchronized void cancelEvent(Context context, long event) {
        String id=Long.toString(event);
        JSONObject items=schedules(context);
        items.remove(id);
        store(context).edit().putString("items",items.toString()).apply();
        context.getSystemService(AlarmManager.class).cancel(alarm(context,id));
        context.getSystemService(NotificationManager.class).cancel(id,1);
    }

    @Override public void onReceive(Context context, Intent intent) {
        synchronized (ReminderReceiver.class) {
            JSONObject items=schedules(context);
            if (!FIRE.equals(intent.getAction())) {
                for (var keys=items.keys(); keys.hasNext();) {
                    String id=keys.next();
                    schedule(context,id,items.optJSONObject(id));
                }
                return;
            }
            String id=intent.getData()==null?null:intent.getData().getLastPathSegment();
            if (id==null) return;
            JSONObject item=items.optJSONObject(id);
            long now=System.currentTimeMillis();
            if (item==null || item.optBoolean("delivered") || item.optLong("start")<=now) return;
            if (item.optLong("at")>now+1000) {
                schedule(context,id,item);
                return;
            }
            NotificationManager manager=context.getSystemService(NotificationManager.class);
            if (!manager.areNotificationsEnabled()) return;
            boolean english=store(context).getBoolean("english",false);
            manager.createNotificationChannel(new NotificationChannel(CHANNEL,
                english?"Event reminders":"Påminnelser om träffar",NotificationManager.IMPORTANCE_DEFAULT));
            Intent open=new Intent(context,MainActivity.class)
                .setData(Uri.parse("hanga-reminder://open/"+id))
                .putExtra(AlertsJob.OPEN_EVENT,Long.parseLong(id))
                .addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            PendingIntent tap=PendingIntent.getActivity(context,0,open,
                PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
            Notification notification=new Notification.Builder(context,CHANNEL)
                .setSmallIcon(context.getApplicationInfo().icon)
                .setContentTitle(item.optString("title"))
                .setContentText(english?"Your meetup is coming up":"Din träff börjar snart")
                .setVisibility(Notification.VISIBILITY_PRIVATE).setAutoCancel(true).setContentIntent(tap).build();
            manager.notify(id,1,notification);
            try { item.put("delivered",true); } catch (JSONException ignored) {}
            store(context).edit().putString("items",items.toString()).apply();
        }
    }
}
