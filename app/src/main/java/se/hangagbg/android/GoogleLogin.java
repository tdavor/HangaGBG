package se.hangagbg.android;

import android.app.Activity;

/** Keeps the offline demo independent of Google Play services and AndroidX. */
public interface GoogleLogin {
    interface Callback { void complete(String token, String error); }
    void start(Callback callback);
    void cancel();
    void signOut();
    static GoogleLogin create(Activity activity) {
        if (activity.getPackageName().endsWith(".demo")) return null;
        try {
            return (GoogleLogin) Class.forName("se.hangagbg.android.NativeGoogleLogin")
                .getConstructor(Activity.class).newInstance(activity);
        } catch (ReflectiveOperationException | LinkageError error) { return null; }
    }
}
