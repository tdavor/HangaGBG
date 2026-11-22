# Enable Google sign-in for HängaGBG 1.8.3

The app uses Android Credential Manager's Google button flow. Google authentication is outside the WebView. Firebase validates the Google credential and issues the same Firebase sessions the Worker already verifies. No Google client secret is embedded in the app.

## Firebase project `hangagbg`

1. Firebase Console → project **hangagbg** → Authentication → Sign-in method → Add new provider → **Google**. Enable it, select the project support email and save.
2. Project settings → General → Android app with package **se.hangagbg.android**. Register SHA-1 and SHA-256 certificate fingerprints:
   - For Google Play installs: use the **App signing key certificate** from Play Console → App integrity / App signing, not only the upload certificate.
   - For APKs installed directly from GitHub: add the release APK signing certificate fingerprints too. Debug builds use a different certificate and need their own Android OAuth registration if used for testing.
3. Download the updated **google-services.json** for that Android app. It must include an OAuth client with `client_type: 3` (Web application client ID). The Google services Gradle plugin generates `default_web_client_id` from this entry. If absent, check the Google provider and OAuth client configuration before downloading again.
4. Update GitHub repository secret **HANGA_GOOGLE_SERVICES_JSON** with the updated file contents. Never put a service-account private key or an OAuth client secret in this file or the app.
5. Deploy the updated Worker from `backend/` before releasing the app: Google users must be allowed to reauthenticate for account deletion. Use your existing Cloudflare deployment configuration and secrets; no new server secret is required.
6. Build the new APK/AAB and test a real Google account on a device with Google Play services. The offline demo has no Google sign-in.

## Behaviour to check

- Existing Firebase UID: the existing HängaGBG profile and history are reused.
- New Firebase UID: choose a unique display name, neighbourhood and optional languages, and explicitly confirm age 18+. Google login alone never publishes a profile.
- Existing-email provider conflict: the app directs the person to the original login method instead of creating a duplicate profile. Firebase account linking, if needed, requires proving ownership; profiles are never merged solely by matching an email string.
- Cancelling the account chooser leaves the current account unchanged.
- Google account deletion: choose the same Google account again; selecting another account must not delete anything.
- Email and password changes for a Google session are managed at Google. Normal profile editing and app account deletion remain available.

Google sign-in requires the provider, OAuth client and signing certificates to be configured in your project. Passing automated tests does not verify those cloud settings.
