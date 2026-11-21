package se.hangagbg.android;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.database.Cursor;
import android.database.MatrixCursor;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;
import java.io.File;
import java.io.FileNotFoundException;

// A temporary single-image provider. Camera apps receive a grant only for this URI.
public final class ProfilePhotoProvider extends ContentProvider {
    static File photoFile(android.content.Context context) { return new File(context.getCacheDir(),"profile-camera.jpg"); }
    private void requirePhoto(Uri uri) {
        if(!"/profile-camera.jpg".equals(uri.getPath()))throw new IllegalArgumentException("Unknown photo");
    }
    @Override public boolean onCreate(){return true;}
    @Override public String getType(Uri uri){requirePhoto(uri);return "image/jpeg";}
    @Override public ParcelFileDescriptor openFile(Uri uri,String mode)throws FileNotFoundException {
        requirePhoto(uri);
        if(!"r".equals(mode)&&!"w".equals(mode)&&!"rw".equals(mode)&&!"rwt".equals(mode))throw new FileNotFoundException("Invalid mode");
        return ParcelFileDescriptor.open(photoFile(getContext()),ParcelFileDescriptor.parseMode(mode));
    }
    @Override public Cursor query(Uri uri,String[] projection,String selection,String[] args,String sort) {
        requirePhoto(uri);File file=photoFile(getContext());
        String[] columns=projection==null?new String[]{OpenableColumns.DISPLAY_NAME,OpenableColumns.SIZE}:projection;
        MatrixCursor cursor=new MatrixCursor(columns);Object[] values=new Object[columns.length];
        for(int i=0;i<columns.length;i++)values[i]=OpenableColumns.DISPLAY_NAME.equals(columns[i])?file.getName():OpenableColumns.SIZE.equals(columns[i])?file.length():null;
        cursor.addRow(values);return cursor;
    }
    @Override public Uri insert(Uri uri,ContentValues values){throw new UnsupportedOperationException();}
    @Override public int update(Uri uri,ContentValues values,String where,String[] args){throw new UnsupportedOperationException();}
    @Override public int delete(Uri uri,String where,String[] args){throw new UnsupportedOperationException();}
}
