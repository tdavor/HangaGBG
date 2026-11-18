package se.hangagbg.android;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import java.util.HashSet;

final class ChatNotifications {
    static final String PUSH_STORAGE = "firebase-chat";
    private static final String CHANNEL = "hangagbg_chat";

    private ChatNotifications() {}

    static synchronized void show(Context context, long owner, long peer, long notice) {
        var alerts = context.getSharedPreferences(AlertsJob.STORAGE, Context.MODE_PRIVATE);
        if (owner<=0 || alerts.getLong("owner",0)!=owner || alerts.getString("token","").isEmpty()) return;
        var manager = context.getSystemService(NotificationManager.class);
        if (!manager.areNotificationsEnabled()) return;
        boolean english = "en".equals(alerts.getString("language","sv"));
        manager.createNotificationChannel(new NotificationChannel(CHANNEL,
            english ? "Chat messages" : "Chattmeddelanden", NotificationManager.IMPORTANCE_HIGH));
        var preferences = context.getSharedPreferences(PUSH_STORAGE, Context.MODE_PRIVATE);
        var seen = new HashSet<>(preferences.getStringSet("seen",java.util.Collections.emptySet()));
        String key = owner+":"+notice;
        if (!seen.add(key)) return;
        if (seen.size()>256) {
            seen.stream().min(java.util.Comparator.comparingLong(entry->Long.parseLong(entry.substring(entry.indexOf(':')+1))))
                .ifPresent(seen::remove);
        }

        int tag = Long.hashCode(notice);
        Intent open = new Intent(context,MainActivity.class).putExtra(AlertsJob.OPEN_CHAT,peer)
            .addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent intent = PendingIntent.getActivity(context,tag,open,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        manager.notify(tag,new Notification.Builder(context,CHANNEL).setSmallIcon(R.drawable.notification_icon)
            .setContentTitle("Hänga Gbg").setContentText(english?"New message":"Nytt meddelande")
            .setVisibility(Notification.VISIBILITY_PRIVATE).setContentIntent(intent).setAutoCancel(true).build());
        preferences.edit().putStringSet("seen",seen).apply();
    }
}
