package se.hangagbg.android;

import android.app.Activity;
import android.os.CancellationSignal;
import androidx.credentials.CredentialManager;
import androidx.credentials.CredentialManagerCallback;
import androidx.credentials.GetCredentialRequest;
import androidx.credentials.GetCredentialResponse;
import androidx.credentials.CustomCredential;
import androidx.credentials.ClearCredentialStateRequest;
import androidx.credentials.exceptions.GetCredentialException;
import androidx.credentials.exceptions.GetCredentialCancellationException;
import androidx.credentials.exceptions.ClearCredentialException;
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption;
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential;

/** Tokens are returned only to the local app; Firebase validates the Google credential. */
public final class NativeGoogleLogin implements GoogleLogin {
    private final Activity activity;
    private final CredentialManager manager;
    private CancellationSignal pending;
    public NativeGoogleLogin(Activity activity) {
        this.activity=activity;
        this.manager=CredentialManager.create(activity);
    }
    @Override public void start(Callback callback) {
        if (pending!=null) {callback.complete("","googleBusy");return;}
        int resource=activity.getResources().getIdentifier("default_web_client_id","string",activity.getPackageName());
        if (resource==0) {callback.complete("","googleSetup");return;}
        String client=activity.getString(resource);
        if (!client.endsWith(".apps.googleusercontent.com")) {callback.complete("","googleSetup");return;}
        CancellationSignal signal=new CancellationSignal();
        pending=signal;
        try {
            String nonce=java.util.UUID.randomUUID().toString()+java.util.UUID.randomUUID();
            var option=new GetSignInWithGoogleOption.Builder(client).setNonce(nonce).build();
            var request=new GetCredentialRequest.Builder().addCredentialOption(option).build();
            manager.getCredentialAsync(activity,request,signal,activity.getMainExecutor(),
                new CredentialManagerCallback<GetCredentialResponse,GetCredentialException>() {
                    @Override public void onResult(GetCredentialResponse result) {
                        if(pending!=signal)return;
                        pending=null;
                        try {
                            var credential=result.getCredential();
                            if (!(credential instanceof CustomCredential) ||
                                !GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL.equals(credential.getType())) {
                                callback.complete("","googleFailed");return;
                            }
                            callback.complete(GoogleIdTokenCredential.createFrom(credential.getData()).getIdToken(),"");
                        } catch(Exception error){callback.complete("","googleFailed");}
                    }
                    @Override public void onError(GetCredentialException error) {
                        if(pending!=signal)return;
                        pending=null;
                        callback.complete("",error instanceof GetCredentialCancellationException?"googleCancelled":"googleFailed");
                    }
                });
        } catch(RuntimeException error){pending=null;callback.complete("","googleFailed");}
    }
    @Override public void cancel(){if(pending!=null){pending.cancel();pending=null;}}
    @Override public void signOut(){
        cancel();
        manager.clearCredentialStateAsync(new ClearCredentialStateRequest(),null,activity.getMainExecutor(),
            new CredentialManagerCallback<Void,ClearCredentialException>() {
                @Override public void onResult(Void result) {}
                @Override public void onError(ClearCredentialException error) {}
            });
    }
}
