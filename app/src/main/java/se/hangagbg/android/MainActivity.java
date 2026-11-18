package se.hangagbg.android;

import android.app.Activity;
import android.app.NotificationManager;
import android.app.job.JobInfo;
import android.app.job.JobScheduler;
import android.content.ComponentName;
import android.Manifest;
import android.content.pm.PackageManager;
import android.webkit.JavascriptInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.WindowInsets;
import android.widget.FrameLayout;
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
    private WebView web;
    private AppUpdate appUpdate;
    private Runnable pendingAlerts;
    private static final int NOTIFICATION_PERMISSION = 12;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        if (!getPackageName().endsWith(".demo")) appUpdate = new AppUpdate(this);
        web = new WebView(this);
        web.setBackgroundColor(0xff102a25);
        FrameLayout content = new FrameLayout(this);
        content.setBackgroundColor(0xff102a25);
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
        setContentView(content);
        content.requestApplyInsets();
        var settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setSupportMultipleWindows(false);
        web.addJavascriptInterface(new AppActions(), "HangaAndroid");
        web.setWebChromeClient(new WebChromeClient());
        web.setWebViewClient(new WebViewClient() {
            @Override public void onPageFinished(WebView view, String url) {
                openEvent(getIntent());
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

    private void openEvent(Intent intent) {
        long id = intent.getLongExtra(AlertsJob.OPEN_EVENT,0);
        if (id > 0) {
            intent.removeExtra(AlertsJob.OPEN_EVENT);
            web.evaluateJavascript("location.hash = 'event/" + id + "'", null);
        }
    }

    @Override protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        openEvent(intent);
    }

    @Override public void onRequestPermissionsResult(int code, String[] permissions, int[] grants) {
        super.onRequestPermissionsResult(code,permissions,grants);
        if (code != NOTIFICATION_PERMISSION) return;
        Runnable setup = pendingAlerts;
        pendingAlerts = null;
        if (grants.length > 0 && grants[0] == PackageManager.PERMISSION_GRANTED) {
            if (setup != null) setup.run();
            web.evaluateJavascript("window.hangaRefreshReminders?.()",null);
        } else {
            web.evaluateJavascript("window.hangaAlertDenied?.()",null);
        }
    }

    @Override protected void onResume() {
        super.onResume();
        if (appUpdate != null) appUpdate.resume();
        if (web != null) web.evaluateJavascript("window.hangaRefreshReminders?.()",null);
    }

    @Override protected void onPause() {
        if (appUpdate != null) appUpdate.pause();
        super.onPause();
    }

    @Override protected void onDestroy() {
        if (appUpdate != null) appUpdate.destroy();
        super.onDestroy();
    }

    private final class AppActions {
        @JavascriptInterface public void syncReminders(String entries, String scope, String language) {
            runOnUiThread(() -> ReminderReceiver.sync(MainActivity.this,entries,scope,"en".equals(language)));
        }

        @JavascriptInterface public void requestReminderPermission() {
            runOnUiThread(() -> {
                if (android.os.Build.VERSION.SDK_INT >= 33 &&
                    checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED &&
                    !getPreferences(MODE_PRIVATE).getBoolean("askedReminderPermission",false)) {
                    getPreferences(MODE_PRIVATE).edit().putBoolean("askedReminderPermission",true).apply();
                    requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS},NOTIFICATION_PERMISSION);
                }
            });
        }

        @JavascriptInterface public void allowReminders() {
            runOnUiThread(() -> {
                if (android.os.Build.VERSION.SDK_INT >= 33 &&
                    checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                    requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS},NOTIFICATION_PERMISSION);
                } else if (!getSystemService(NotificationManager.class).areNotificationsEnabled()) {
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
                Runnable setup = () -> {
                    if (!getSystemService(NotificationManager.class).areNotificationsEnabled()) {
                        web.evaluateJavascript("window.hangaAlertDenied?.()",null);
                        return;
                    }
                    getSharedPreferences(AlertsJob.STORAGE,MODE_PRIVATE).edit()
                        .putString("origin",origin).putString("token",token)
                        .putLong("cursor",Long.parseLong(cursor)).putString("language",language)
                        .putLong("owner",Long.parseLong(owner)).putString("area",area)
                        .putLong("seenEvent",Long.parseLong(latest)).apply();
                    JobInfo job = new JobInfo.Builder(AlertsJob.JOB_ID,new ComponentName(MainActivity.this,AlertsJob.class))
                        .setRequiredNetworkType(JobInfo.NETWORK_TYPE_ANY)
                        .setPeriodic(JobInfo.getMinPeriodMillis()).setPersisted(true).build();
                    try {
                        if (getSystemService(JobScheduler.class).schedule(job)==JobScheduler.RESULT_SUCCESS) return;
                    } catch (IllegalArgumentException | SecurityException error) {
                        android.util.Log.w("HangaGBG","Could not schedule notifications",error);
                    }
                    getSharedPreferences(AlertsJob.STORAGE,MODE_PRIVATE).edit().clear().apply();
                    web.evaluateJavascript("window.hangaAlertFailed?.()",null);
                };
                if (android.os.Build.VERSION.SDK_INT >= 33 &&
                    checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                    pendingAlerts = setup;
                    requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS},NOTIFICATION_PERMISSION);
                } else {
                    setup.run();
                }
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
                pendingAlerts = null;
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
