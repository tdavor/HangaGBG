package se.hangagbg.android;

import android.app.Application;
import com.google.firebase.FirebaseApp;
import com.google.firebase.messaging.FirebaseMessaging;

public final class PushApplication extends Application {
    @Override public void onCreate() {
        super.onCreate();
        if (!FirebaseApp.getApps(this).isEmpty()) {
            FirebaseMessaging.getInstance().getToken().addOnSuccessListener(token ->
                getSharedPreferences(ChatNotifications.PUSH_STORAGE, MODE_PRIVATE).edit().putString("token", token).apply());
        }
    }
}
