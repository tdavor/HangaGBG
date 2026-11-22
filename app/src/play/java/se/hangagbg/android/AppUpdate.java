package se.hangagbg.android;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;

// Google Play builds never fetch or install an APK themselves.
final class AppUpdate {
    private final Activity activity;
    AppUpdate(Activity activity){this.activity=activity;}
    void resume(){}
    void pause(){}
    void destroy(){}
    void checkNow(boolean english){
        try {
            activity.startActivity(new Intent(Intent.ACTION_VIEW,Uri.parse("market://details?id="+activity.getPackageName())).setPackage("com.android.vending"));
        } catch(android.content.ActivityNotFoundException unavailable){
            try {activity.startActivity(new Intent(Intent.ACTION_VIEW,Uri.parse("https://play.google.com/store/apps/details?id="+activity.getPackageName())));}
            catch(android.content.ActivityNotFoundException ignored){}
        }
    }
}
