package se.hangagbg.android;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public final class ChatMessagingService extends FirebaseMessagingService {
    @Override public void onNewToken(String token) {
        getSharedPreferences(ChatNotifications.PUSH_STORAGE, MODE_PRIVATE).edit().putString("token", token).apply();
    }

    @Override public void onMessageReceived(RemoteMessage message) {
        var data = message.getData();
        if (!"chat".equals(data.get("kind"))) return;
        try {
            long owner = Long.parseLong(data.get("owner"));
            long peer = Long.parseLong(data.get("peer"));
            long notice = Long.parseLong(data.get("notice"));
            if (owner>0 && peer>0 && notice>0) ChatNotifications.show(this,owner,peer,notice);
        } catch (NumberFormatException ignored) {}
    }
}
