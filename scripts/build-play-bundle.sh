#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
: "${HANGA_KEYSTORE:?Set HANGA_KEYSTORE to the existing upload keystore outside the repository}"
: "${HANGA_STOREPASS:?Set HANGA_STOREPASS}"
: "${HANGA_KEYPASS:?Set HANGA_KEYPASS}"
: "${HANGA_KEY_ALIAS:?Set HANGA_KEY_ALIAS}"
test -s app/google-services.json
# Gradle signs the bundle using the existing protected keystore environment.
gradle --no-daemon -Pandroid.useAndroidX=true :app:bundlePlayRelease
out=app/build/outputs/play
mkdir -p "$out"
cp app/build/outputs/bundle/playRelease/app-play-release.aab "$out/HangaGBG-Play.aab"
cert=$(keytool -exportcert -keystore "$HANGA_KEYSTORE" -alias "$HANGA_KEY_ALIAS" -storepass:env HANGA_STOREPASS | sha256sum | cut -d ' ' -f 1)
java scripts/VerifyBundle.java "$out/HangaGBG-Play.aab" "$cert"
python3 scripts/verify-play-bundle.py "$out/HangaGBG-Play.aab" "$cert"
