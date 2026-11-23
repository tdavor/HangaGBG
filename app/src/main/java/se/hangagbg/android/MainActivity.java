package se.hangagbg.android;

import android.app.Activity;
import android.app.NotificationManager;
import android.app.job.JobInfo;
import android.app.job.JobScheduler;
import android.content.ComponentName;
import android.Manifest;
import android.content.pm.PackageManager;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.WindowInsets;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ImageView;
import android.widget.TextView;
import android.view.Gravity;
import android.view.View;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import java.io.IOException;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;

public final class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final int PHOTO_PICKER = 73;
    private static final int PHOTO_CAMERA = 74;
    private Uri cameraPhoto;
    private ValueCallback<Uri[]> photoPicker;
    private WebView web;
    private LinearLayout splash;
    private boolean webReady;
    private AppUpdate appUpdate;
    private GoogleLogin googleLogin;
    private static final int NOTIFICATION_PERMISSION = 12;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        googleLogin=GoogleLogin.create(this);
        if (!getPackageName().endsWith(".demo")) appUpdate = new AppUpdate(this);
        web = new WebView(this);
        web.setBackgroundColor(0xfffbf8f2);
        FrameLayout content = new FrameLayout(this);
        content.setBackgroundColor(0xfffbf8f2);
        content.addView(web, new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
        if (android.os.Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            content.setOnApplyWindowInsetsListener((view, insets) -> {
                int types = WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout();
                var safe = insets.getInsetsIgnoringVisibility(types);
                var keyboard = insets.getInsets(WindowInsets.Type.ime());
                view.setPadding(safe.left, safe.top, safe.right, Math.max(safe.bottom, keyboard.bottom));
                return WindowInsets.CONSUMED;
            });
        }
        getWindow().setStatusBarColor(0xfffbf8f2);
        getWindow().setNavigationBarColor(0xfffbf8f2);
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
        showSplash(content);
        setContentView(content);
        content.requestApplyInsets();
        var settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true);
        settings.setSupportMultipleWindows(false);
        web.addJavascriptInterface(new AppActions(), "HangaAndroid");
        web.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if(photoPicker!=null)photoPicker.onReceiveValue(null);
                photoPicker=callback;
                if(params.isCaptureEnabled()) {
                    ProfilePhotoProvider.photoFile(MainActivity.this).delete();
                    cameraPhoto=Uri.parse("content://"+getPackageName()+".profilephotos/profile-camera.jpg");
                    Intent camera=new Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
                    camera.putExtra(android.provider.MediaStore.EXTRA_OUTPUT,cameraPhoto);
                    camera.setClipData(android.content.ClipData.newRawUri("Profile photo",cameraPhoto));
                    camera.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION|Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
                    try {startActivityForResult(camera,PHOTO_CAMERA);}
                    catch(android.content.ActivityNotFoundException error){photoPicker.onReceiveValue(null);photoPicker=null;cameraPhoto=null;}
                    return true;
                }
                Intent choose=new Intent(Intent.ACTION_OPEN_DOCUMENT);
                choose.addCategory(Intent.CATEGORY_OPENABLE);
                choose.setType("image/*");
                choose.putExtra(Intent.EXTRA_MIME_TYPES,new String[]{"image/jpeg","image/png","image/webp"});
                try {startActivityForResult(choose,PHOTO_PICKER);}
                catch(android.content.ActivityNotFoundException error){photoPicker.onReceiveValue(null);photoPicker=null;}
                return true;
            }
        });
        web.setWebViewClient(new WebViewClient() {
            @Override public void onPageFinished(WebView view, String url) {
                webReady = true;
                // The launch splash has its own two-second timer, independent of page loads.
                openNotification(getIntent());
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if ("https".equals(uri.getScheme()) && HOST.equals(uri.getHost())) return false;
                if (request.isForMainFrame() && request.hasGesture() && ("https".equals(uri.getScheme())
                    || "mailto:t.davor@gmail.com".equals(uri.toString()))) {
                    openExternalLink(uri);
                }
                return true;
            }
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (!HOST.equals(uri.getHost()) || !"https".equals(uri.getScheme())) return null;
                String path = uri.getPath();
                if (path == null) return missing();
                String type = switch (path) {
                    case "/index.html" -> "text/html";
                    case "/config.js", "/firebase.js", "/app.js" -> "text/javascript";
                    case "/style.css" -> "text/css";
                    case "/brand-mark.png" -> "image/png";
                    default -> null;
                };
                if (type == null) return missing();
                try { return new WebResourceResponse(type, "UTF-8", getAssets().open(path.substring(1))); }
                catch (IOException e) { return missing(); }
            }
        });
        if (state == null || web.restoreState(state) == null) {
            String entry = "https://" + HOST + "/index.html";
            if (getPackageName().endsWith(".demo")) {
                try (InputStream stream = getAssets().open("index.html")) {
                    ByteArrayOutputStream buffer = new ByteArrayOutputStream();
                    byte[] chunk = new byte[8192];
                    int length;
                    while ((length = stream.read(chunk)) != -1) buffer.write(chunk, 0, length);
                    String html = new String(buffer.toByteArray(), StandardCharsets.UTF_8);
                    web.loadDataWithBaseURL(entry, html, "text/html", "UTF-8", entry);
                } catch (IOException error) {
                    web.loadData("<p>Hänga Gbg Demo could not start.</p>", "text/html", "UTF-8");
                }
            } else {
                web.loadUrl(entry);
            }
        }
    }

    @Override protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request,result,data);
        if((request!=PHOTO_PICKER&&request!=PHOTO_CAMERA)||photoPicker==null)return;
        Uri uri=request==PHOTO_CAMERA?(result==RESULT_OK&&prepareCameraImage()?cameraPhoto:null):result==RESULT_OK&&data!=null?data.getData():null;
        if(request==PHOTO_CAMERA&&uri==null)ProfilePhotoProvider.photoFile(this).delete();
        cameraPhoto=null;
        boolean image=false;
        if(uri!=null&&"content".equals(uri.getScheme())) {
            try {
                String mime=getContentResolver().getType(uri);
                image="image/jpeg".equals(mime)||"image/png".equals(mime)||"image/webp".equals(mime);
            } catch(SecurityException ignored) {}
        }
        photoPicker.onReceiveValue(image?new Uri[]{uri}:null);
        photoPicker=null;
    }

    private boolean prepareCameraImage() {
        java.io.File file=ProfilePhotoProvider.photoFile(this);
        if(file.length()==0||file.length()>32L*1024*1024)return false;
        android.graphics.Bitmap image=null,rotated=null;
        try {
            android.graphics.BitmapFactory.Options options=new android.graphics.BitmapFactory.Options();
            options.inJustDecodeBounds=true;
            android.graphics.BitmapFactory.decodeFile(file.getPath(),options);
            if(options.outWidth<=0||options.outHeight<=0)return false;
            options.inSampleSize=1;
            while(Math.max(options.outWidth,options.outHeight)/options.inSampleSize>1024)options.inSampleSize*=2;
            options.inJustDecodeBounds=false;
            image=android.graphics.BitmapFactory.decodeFile(file.getPath(),options);
            if(image==null)return false;
            int orientation=new android.media.ExifInterface(file.getPath()).getAttributeInt(android.media.ExifInterface.TAG_ORIENTATION,1);
            android.graphics.Matrix matrix=new android.graphics.Matrix();
            switch(orientation){
                case 2:matrix.setScale(-1,1);break;
                case 3:matrix.setRotate(180);break;
                case 4:matrix.setScale(1,-1);break;
                case 5:matrix.setRotate(90);matrix.postScale(-1,1);break;
                case 6:matrix.setRotate(90);break;
                case 7:matrix.setRotate(-90);matrix.postScale(-1,1);break;
                case 8:matrix.setRotate(270);break;
                default:break;
            }
            rotated=android.graphics.Bitmap.createBitmap(image,0,0,image.getWidth(),image.getHeight(),matrix,true);
            try(java.io.FileOutputStream output=new java.io.FileOutputStream(file)){
                return rotated.compress(android.graphics.Bitmap.CompressFormat.JPEG,85,output);
            }
        } catch(java.io.IOException|RuntimeException error){return false;}
        finally {if(rotated!=null&&rotated!=image)rotated.recycle();if(image!=null)image.recycle();}
    }

    private int dp(int value) { return Math.round(value * getResources().getDisplayMetrics().density); }

    private void showSplash(FrameLayout content) {
        splash = new LinearLayout(this);
        splash.setOrientation(LinearLayout.VERTICAL);
        splash.setGravity(Gravity.CENTER);
        splash.setBackgroundColor(0xfffbf8f2);
        splash.setImportantForAccessibility(View.IMPORTANT_FOR_ACCESSIBILITY_YES);
        ImageView mark = new ImageView(this);
        mark.setImageResource(R.drawable.logo_mark);
        mark.setScaleType(ImageView.ScaleType.FIT_CENTER);
        mark.setContentDescription("HängaGBG");
        splash.addView(mark, new LinearLayout.LayoutParams(dp(160),dp(160)));
        TextView title = new TextView(this);
        title.setText("HängaGBG");
        title.setTextSize(28);
        title.setTextColor(0xff183a2a);
        title.setTypeface(null,android.graphics.Typeface.BOLD);
        LinearLayout.LayoutParams titleParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,LinearLayout.LayoutParams.WRAP_CONTENT);
        titleParams.topMargin=dp(24);
        splash.addView(title,titleParams);
        content.addView(splash,new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,FrameLayout.LayoutParams.MATCH_PARENT));
        // Keep the launch artwork visible for two seconds, even for a fast local page.
        // Backend requests and page reloads do not extend or restart this timer.
        web.postDelayed(() -> hideSplash(), 2000);
    }

    private void hideSplash() {
        if(splash == null) return;
        if(splash.getParent() instanceof FrameLayout) ((FrameLayout)splash.getParent()).removeView(splash);
        splash=null;
    }

    private void openExternalLink(Uri uri) {
        Intent view = new Intent("mailto".equals(uri.getScheme()) ? Intent.ACTION_SENDTO : Intent.ACTION_VIEW, uri);
        if ("www.google.com".equals(uri.getHost()) && "/maps/search/".equals(uri.getPath())) {
            try {
                startActivity(new Intent(view).setPackage("com.google.android.apps.maps"));
                return;
            } catch (android.content.ActivityNotFoundException ignored) {
                // Android can open the Google Maps website through a browser.
            }
        }
        try { startActivity(view); }
        catch (android.content.ActivityNotFoundException ignored) {}
    }

    private void openNotification(Intent intent) {
        if (!webReady) return;
        long peer = intent.getLongExtra(AlertsJob.OPEN_CHAT,0);
        long event = intent.getLongExtra(AlertsJob.OPEN_EVENT,0);
        String section=intent.getStringExtra(AlertsJob.OPEN_SECTION);
        if (peer==0 && event<=0 && !"friends".equals(section)) return;
        intent.removeExtra(AlertsJob.OPEN_SECTION);
        intent.removeExtra(AlertsJob.OPEN_CHAT);
        intent.removeExtra(AlertsJob.OPEN_EVENT);
        String route = "friends".equals(section)?"friends":peer>0 ? "messages/"+peer : peer<0 ? "messages" : "event/"+event;
        if (peer==0 && event>0 && ("group".equals(section)||"feedback".equals(section)||"again".equals(section))) route=section+"/"+event;
        web.evaluateJavascript("location.hash = '"+route+"'; window.hangaRefreshChats?.();", null);
    }

    @Override protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        openNotification(intent);
    }

    @Override public void onRequestPermissionsResult(int code, String[] permissions, int[] grants) {
        super.onRequestPermissionsResult(code,permissions,grants);
        if (code != NOTIFICATION_PERMISSION) return;
        if (grants.length > 0 && grants[0] == PackageManager.PERMISSION_GRANTED) refreshNotifications();
    }

    private void refreshNotifications() {
        if (web != null) web.evaluateJavascript(
            "window.hangaRefreshReminders?.(); window.hangaSyncAlerts?.(); window.hangaRefreshChats?.();",null);
    }

    @Override protected void onResume() {
        super.onResume();
        if (appUpdate != null) appUpdate.resume();
        if (!getPackageName().endsWith(".demo") && android.os.Build.VERSION.SDK_INT >= 33
            && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
            && !getPreferences(MODE_PRIVATE).getBoolean("askedNotificationPermission",false)) {
            getPreferences(MODE_PRIVATE).edit().putBoolean("askedNotificationPermission",true).apply();
            requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS},NOTIFICATION_PERMISSION);
        }
        refreshNotifications();
    }

    @Override protected void onPause() {
        if (appUpdate != null) appUpdate.pause();
        super.onPause();
    }

    @Override protected void onDestroy() {
        if(photoPicker!=null){photoPicker.onReceiveValue(null);photoPicker=null;}
        if (googleLogin != null) googleLogin.cancel();
        if (appUpdate != null) appUpdate.destroy();
        super.onDestroy();
    }

    private final class AppActions {
        @JavascriptInterface public boolean googleSignInAvailable() { return googleLogin!=null; }
        @JavascriptInterface public void googleCancel() {
            runOnUiThread(() -> {if(googleLogin!=null)googleLogin.cancel();});
        }
        @JavascriptInterface public void googleSignOut() {
            runOnUiThread(() -> {if(googleLogin!=null)googleLogin.signOut();});
        }
        @JavascriptInterface public void googleSignIn(String requestId) {
            if(requestId==null || !requestId.matches("[a-zA-Z0-9_-]{16,80}"))return;
            runOnUiThread(() -> {
                if(web==null || web.getUrl()==null || !web.getUrl().startsWith("https://"+HOST+"/"))return;
                GoogleLogin.Callback callback=(token,error)-> {
                    if(isFinishing() || isDestroyed())return;
                    web.evaluateJavascript("window.hangaGoogleResult?.("+org.json.JSONObject.quote(requestId)+","+
                        org.json.JSONObject.quote(token)+","+org.json.JSONObject.quote(error)+")",null);
                };
                if(googleLogin==null)callback.complete("","googleSetup");else googleLogin.start(callback);
            });
        }

        @JavascriptInterface public void clearCameraPhoto() {
            runOnUiThread(() -> ProfilePhotoProvider.photoFile(MainActivity.this).delete());
        }

        @JavascriptInterface public void syncReminders(String entries, String scope, String language) {
            runOnUiThread(() -> ReminderReceiver.sync(MainActivity.this,entries,scope,"en".equals(language)));
        }

        @JavascriptInterface public String firebasePushToken() {
            return getSharedPreferences(ChatNotifications.PUSH_STORAGE,MODE_PRIVATE).getString("token","");
        }

        @JavascriptInterface public boolean notificationsEnabled() {
            return getSystemService(NotificationManager.class).areNotificationsEnabled();
        }

        @JavascriptInterface public boolean alertsScheduled(String token) {
            return !token.isEmpty() && token.equals(getSharedPreferences(AlertsJob.STORAGE,MODE_PRIVATE).getString("token",""))
                && getSystemService(JobScheduler.class).getPendingJob(AlertsJob.JOB_ID) != null;
        }

        @JavascriptInterface public void allowReminders() {
            runOnUiThread(() -> {
                if (!notificationsEnabled()) {
                    startActivity(new Intent(android.provider.Settings.ACTION_APP_NOTIFICATION_SETTINGS)
                        .putExtra(android.provider.Settings.EXTRA_APP_PACKAGE,getPackageName()));
                }
            });
        }

        @JavascriptInterface public boolean preciseReminderAccessNeeded() {
            return android.os.Build.VERSION.SDK_INT >= 31 &&
                !getSystemService(android.app.AlarmManager.class).canScheduleExactAlarms();
        }

        @JavascriptInterface public void allowPreciseReminders() {
            runOnUiThread(() -> {
                if (!preciseReminderAccessNeeded()) return;
                try {
                    startActivity(new Intent(android.provider.Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM,
                        Uri.parse("package:"+getPackageName())));
                } catch (android.content.ActivityNotFoundException ignored) {}
            });
        }

        @JavascriptInterface public String appVersion() {
            try {
                return getPackageManager().getPackageInfo(getPackageName(), 0).versionName;
            } catch (PackageManager.NameNotFoundException ignored) {
                return "";
            }
        }

        @JavascriptInterface public void checkForUpdate(String language) {
            runOnUiThread(() -> {
                if (appUpdate != null) appUpdate.checkNow("en".equals(language));
            });
        }

        @JavascriptInterface public void shareText(String text) {
            if (text == null || text.length() > 5000) return;
            runOnUiThread(() -> startActivity(Intent.createChooser(
                new Intent(Intent.ACTION_SEND).setType("text/plain").putExtra(Intent.EXTRA_TEXT,text), null)));
        }

        @JavascriptInterface public void startAlerts(String origin,String token,String cursor,String language,String owner,String area,String latest) {
            if (getPackageName().endsWith(".demo") || !origin.matches("https://(?:[a-z0-9-]+\\.){2}workers\\.dev")
                || !token.matches("[a-f0-9-]{72}") || !cursor.matches("[0-9]{1,16}")
                || !owner.matches("[0-9]{1,16}") || !latest.matches("[0-9]{1,16}") || area.length()>200) return;
            runOnUiThread(() -> {
                if (!notificationsEnabled()) return;
                getSharedPreferences(AlertsJob.STORAGE,MODE_PRIVATE).edit()
                    .putString("origin",origin).putString("token",token)
                    .putLong("cursor",Long.parseLong(cursor)).putString("language",language)
                    .putLong("owner",Long.parseLong(owner)).putString("area",area)
                    .putLong("seenEvent",Long.parseLong(latest)).apply();
                JobInfo job = new JobInfo.Builder(AlertsJob.JOB_ID,new ComponentName(MainActivity.this,AlertsJob.class))
                    .setRequiredNetworkType(JobInfo.NETWORK_TYPE_ANY)
                    .setPeriodic(JobInfo.getMinPeriodMillis()).setPersisted(true).build();
                try {
                    if (getSystemService(JobScheduler.class).schedule(job)==JobScheduler.RESULT_SUCCESS) {
                        web.evaluateJavascript("window.hangaSyncPush?.()",null);
                        return;
                    }
                } catch (IllegalArgumentException | SecurityException error) {
                    android.util.Log.w("HangaGBG","Could not schedule notifications",error);
                }
                getSharedPreferences(AlertsJob.STORAGE,MODE_PRIVATE).edit().clear().apply();
                web.evaluateJavascript("window.hangaAlertFailed?.()",null);
            });
        }

        @JavascriptInterface public void syncAlertProfile(String token,String owner,String area,String language) {
            if (getPackageName().endsWith(".demo") || !token.matches("[a-f0-9-]{72}")
                || !owner.matches("[0-9]{1,16}") || area.length()>200) return;
            runOnUiThread(() -> {
                var preferences = getSharedPreferences(AlertsJob.STORAGE,MODE_PRIVATE);
                if (!token.equals(preferences.getString("token",""))) return;
                preferences.edit().putLong("owner",Long.parseLong(owner)).putString("area",area)
                    .putString("language",language).apply();
            });
        }

        @JavascriptInterface public void stopAlerts() {
            if (getPackageName().endsWith(".demo")) return;
            runOnUiThread(() -> {
                getSharedPreferences(AlertsJob.STORAGE,MODE_PRIVATE).edit().clear().apply();
                getSystemService(JobScheduler.class).cancel(AlertsJob.JOB_ID);
                getSystemService(NotificationManager.class).cancelAll();
            });
        }
    }

    private static WebResourceResponse missing() {
        return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found",
            Collections.emptyMap(), new ByteArrayInputStream(new byte[0]));
    }

    @Override protected void onSaveInstanceState(Bundle state) {
        web.saveState(state);
        super.onSaveInstanceState(state);
    }

    @Override public void onBackPressed() {
        if (web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }
}
