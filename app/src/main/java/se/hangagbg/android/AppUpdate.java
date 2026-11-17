package se.hangagbg.android;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.net.ssl.HttpsURLConnection;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

final class AppUpdate {
    private static final String API = "https://api.github.com/repos/tdavor/HangaGBG/releases/latest";
    private static final String DOWNLOAD = "https://github.com/tdavor/HangaGBG/releases/download/";
    private static final String APK = "HangaGBG.apk";

    private final Activity activity;
    private final DownloadManager downloads;
    private final SharedPreferences state;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private final ExecutorService worker = Executors.newSingleThreadExecutor();
    private final Runnable checkDownload = this::checkDownload;
    private boolean foreground;
    private boolean checked;
    private boolean validating;
    private long offered;

    AppUpdate(Activity activity) {
        this.activity = activity;
        downloads = activity.getSystemService(DownloadManager.class);
        state = activity.getSharedPreferences("app-update",Context.MODE_PRIVATE);
    }

    void resume() {
        foreground=true;
        checkDownload();
        if (!checked && state.getLong("download",0)==0) {
            checked=true;
            worker.execute(this::checkRelease);
        }
    }

    void pause() {
        foreground=false;
        handler.removeCallbacks(checkDownload);
    }

    void destroy() {
        pause();
        worker.shutdownNow();
    }

    private PackageInfo current() throws PackageManager.NameNotFoundException {
        return activity.getPackageManager().getPackageInfo(activity.getPackageName(),PackageManager.GET_SIGNATURES);
    }

    // Release tags are vMAJOR.MINOR.PATCH. Compare components numerically.
    static int compareVersions(String left,String right) {
        if (left==null || right==null
            || !left.matches("v?[0-9]{1,8}\\.[0-9]{1,8}\\.[0-9]{1,8}")
            || !right.matches("v?[0-9]{1,8}\\.[0-9]{1,8}\\.[0-9]{1,8}")) return 0;
        String[] a=left.replaceFirst("^v","").split("\\.");
        String[] b=right.replaceFirst("^v","").split("\\.");
        for (int i=0;i<3;i++) {
            int cmp=Integer.compare(Integer.parseInt(a[i]),Integer.parseInt(b[i]));
            if (cmp!=0) return cmp;
        }
        return 0;
    }

    private JSONObject release() throws Exception {
        HttpsURLConnection connection=(HttpsURLConnection)new URL(API).openConnection();
        try {
            connection.setConnectTimeout(8000);
            connection.setReadTimeout(8000);
            connection.setRequestProperty("Accept","application/vnd.github+json");
            connection.setRequestProperty("User-Agent","HangaGBG-Android");
            if (connection.getResponseCode()!=200) return null;
            try (var input=connection.getInputStream(); var bytes=new ByteArrayOutputStream()) {
                byte[] buffer=new byte[4096];
                int size;
                while ((size=input.read(buffer))!=-1) {
                    if (bytes.size()+size>1024*1024) throw new IOException("Release metadata too large");
                    bytes.write(buffer,0,size);
                }
                return new JSONObject(new String(bytes.toByteArray(),StandardCharsets.UTF_8));
            }
        } finally {
            connection.disconnect();
        }
    }

    private void checkRelease() {
        try {
            JSONObject release=release();
            if (release==null || release.optBoolean("draft") || release.optBoolean("prerelease")) return;
            String tag=release.optString("tag_name");
            if (compareVersions(tag,current().versionName)<=0) return;
            JSONArray assets=release.optJSONArray("assets");
            if (assets==null) return;
            String expected=DOWNLOAD+tag+"/"+APK;
            for (int i=0;i<assets.length();i++) {
                JSONObject asset=assets.optJSONObject(i);
                if (asset!=null && APK.equals(asset.optString("name"))
                    && expected.equals(asset.optString("browser_download_url"))) {
                    activity.runOnUiThread(()->startDownload(tag,expected));
                    return;
                }
            }
        } catch (Exception error) {
            android.util.Log.d("HangaGBG","Release check unavailable",error);
        }
    }

    private void startDownload(String tag,String url) {
        if (activity.isDestroyed() || state.getLong("download",0)!=0) return;
        try {
            DownloadManager.Request request=new DownloadManager.Request(Uri.parse(url))
                .setTitle("Hänga Gbg "+tag)
                .setMimeType("application/vnd.android.package-archive")
                .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE)
                .setDestinationInExternalFilesDir(activity,"updates","hanga-"+tag+".apk");
            long id=downloads.enqueue(request);
            state.edit().putLong("download",id).putString("tag",tag).apply();
            checkDownload();
        } catch (RuntimeException error) {
            android.util.Log.w("HangaGBG","Update download could not start",error);
        }
    }

    private void checkDownload() {
        handler.removeCallbacks(checkDownload);
        long id=state.getLong("download",0);
        if (!foreground || id==0 || validating) return;
        String tag=state.getString("tag","");
        try (var row=downloads.query(new DownloadManager.Query().setFilterById(id))) {
            if (compareVersions(tag,current().versionName)<=0 || row==null || !row.moveToFirst()) {
                clear(id);
                return;
            }
            int status=row.getInt(row.getColumnIndexOrThrow(DownloadManager.COLUMN_STATUS));
            if (status==DownloadManager.STATUS_FAILED) {
                clear(id);
            } else if (status==DownloadManager.STATUS_SUCCESSFUL && offered!=id) {
                String file=row.getString(row.getColumnIndexOrThrow(DownloadManager.COLUMN_LOCAL_URI));
                validating=true;
                worker.execute(()->validate(id,tag,file));
            } else if (status!=DownloadManager.STATUS_SUCCESSFUL) {
                handler.postDelayed(checkDownload,1500);
            }
        } catch (Exception error) {
            android.util.Log.w("HangaGBG","Could not inspect update download",error);
        }
    }

    private void validate(long id,String tag,String file) {
        boolean valid=false;
        try {
            Uri location=Uri.parse(file);
            if ("file".equals(location.getScheme())) {
                PackageInfo installed=current();
                PackageInfo update=activity.getPackageManager().getPackageArchiveInfo(
                    location.getPath(),PackageManager.GET_SIGNATURES);
                valid=update!=null && activity.getPackageName().equals(update.packageName)
                    && compareVersions(update.versionName,tag)==0 && compareVersions(update.versionName,installed.versionName)>0
                    && (Build.VERSION.SDK_INT>=28?update.getLongVersionCode()>installed.getLongVersionCode():update.versionCode>installed.versionCode)
                    && installed.signatures!=null && installed.signatures.length>0 && update.signatures!=null
                    && new HashSet<>(Arrays.asList(installed.signatures)).equals(new HashSet<>(Arrays.asList(update.signatures)));
            }
        } catch (Exception error) {
            android.util.Log.w("HangaGBG","Could not validate update package",error);
        }
        boolean allowed=valid;
        activity.runOnUiThread(()->{
            validating=false;
            if (activity.isDestroyed() || state.getLong("download",0)!=id) return;
            if (!allowed) {
                clear(id);
                return;
            }
            if (foreground) install(id);
        });
    }

    private void install(long id) {
        Uri apk=downloads.getUriForDownloadedFile(id);
        if (apk==null) {
            clear(id);
            return;
        }
        try {
            if (!activity.getPackageManager().canRequestPackageInstalls()) {
                offered=id;
                boolean english=Locale.getDefault().getLanguage().equals("en");
                new AlertDialog.Builder(activity)
                    .setTitle(english?"Update ready":"Uppdatering klar")
                    .setMessage(english?"Allow Hänga Gbg to open the Android installer.":"Tillåt Hänga Gbg att öppna Androids installationsprogram.")
                    .setNegativeButton(english?"Later":"Senare",null)
                    .setPositiveButton(english?"Settings":"Inställningar",(dialog,which)->{
                        offered=0;
                        activity.startActivity(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                            Uri.parse("package:"+activity.getPackageName())));
                    }).show();
                return;
            }
            offered=id;
            activity.startActivity(new Intent(Intent.ACTION_INSTALL_PACKAGE,apk)
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION));
        } catch (RuntimeException error) {
            android.util.Log.w("HangaGBG","Could not open Android installer",error);
        }
    }

    private void clear(long id) {
        downloads.remove(id);
        state.edit().clear().apply();
    }
}
