#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
sdk="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}"
: "${sdk:?Set ANDROID_HOME to the Android SDK directory}"
tools="$sdk/build-tools/35.0.0"
platform="$sdk/platforms/android-35/android.jar"
variant="${1:-firebase}"
case "$variant" in firebase|demo) ;; *) echo "Usage: $0 [firebase|demo]" >&2; exit 2;; esac
out="$(pwd)/app/build/manual/$variant"
mkdir -p "$out/classes" "$out/dex" "$out/generated"
key_dir="$(pwd)/app/build/manual"
manifest=app/src/main/AndroidManifest.xml
assets=app/src/main/assets
package_id=se.hangagbg.android
apk_name=HangaGBG.apk
if [[ "$variant" == demo ]]; then
  manifest="$out/AndroidManifest.xml"
  assets="$out/offline-assets"
  mkdir -p "$assets"
  python3 - "$assets/index.html" <<'PYTHON'
from base64 import b64encode
from pathlib import Path
import sys
source = Path("app/src/main/assets")
html = (source / "index.html").read_text()
html = html.replace("connect-src https:", "connect-src 'none'")
html = html.replace("img-src 'self'", "img-src 'self' data:")
brand = b64encode((source / "brand-mark.png").read_bytes()).decode("ascii")
html = html.replace('src="brand-mark.png"', 'src="data:image/png;base64,' + brand + '"')
html = html.replace("style-src 'self'; script-src 'self'", "style-src 'unsafe-inline'; script-src 'unsafe-inline'")
css = (source / "style.css").read_text()
js = (source / "app.js").read_text().replace("</script", "<\\/script")
html = html.replace('<link rel="stylesheet" href="style.css">', "<style>" + css + "</style>")
html = html.replace('<script src="config.js" defer></script>', '<script>window.HANGA_DEMO = true;</script>')
html = html.replace('<script src="firebase.js" defer></script>', "")
html = html.replace('<script src="app.js" defer></script>', "")
html = html.replace("</body>", "<script>" + js + "</script></body>")
Path(sys.argv[1]).write_text(html)
PYTHON
  sed '/android.permission.INTERNET/d; /android.permission.REQUEST_INSTALL_PACKAGES/d; /android.permission.BIND_JOB_SERVICE/d; s/android:label="Hänga Gbg"/android:label="Hänga Gbg Demo"/' \
    app/src/main/AndroidManifest.xml > "$manifest"
  package_id=se.hangagbg.android.demo
  apk_name=Hanga-Gbg-Demo.apk
fi
"$tools/aapt2" compile --dir app/src/main/res -o "$out/resources.zip"
"$tools/aapt2" link -I "$platform" --manifest "$manifest" \
  --rename-manifest-package "$package_id" --version-code 15 --version-name 1.3.9 \
  --min-sdk-version 26 --target-sdk-version 35 -A "$assets" --java "$out/generated" --custom-package se.hangagbg.android \
  -o "$out/package.apk" "$out/resources.zip"
java -m jdk.compiler/com.sun.tools.javac.Main -source 17 -target 17 -classpath "$platform" \
  -d "$out/classes" app/src/main/java/se/hangagbg/android/*.java "$out/generated/se/hangagbg/android/R.java"
# Package the compiled classes for D8 without depending on a separate jar executable.
(cd "$out/classes" && zip -q -r "$out/classes.zip" .)
"$tools/d8" --min-api 26 --lib "$platform" --output "$out/dex" "$out/classes.zip"
(cd "$out/dex" && zip -q -j "$out/package.apk" classes.dex)
"$tools/zipalign" -f 4 "$out/package.apk" "$out/aligned.apk"
debug_key="${HANGA_KEYSTORE:-$key_dir/debug.keystore}"
if [[ ! -f "$debug_key" && -z "${HANGA_KEYSTORE:-}" ]]; then
  keytool -genkeypair -keystore "$debug_key" -storepass android -keypass android \
    -alias androiddebugkey -dname "CN=Android Debug,O=Android,C=US" -keyalg RSA -validity 10000
fi
export HANGA_STOREPASS="${HANGA_STOREPASS:-android}"
export HANGA_KEYPASS="${HANGA_KEYPASS:-$HANGA_STOREPASS}"
"$tools/apksigner" sign --ks "$debug_key" --ks-key-alias "${HANGA_KEY_ALIAS:-androiddebugkey}" \
  --ks-pass env:HANGA_STOREPASS --key-pass env:HANGA_KEYPASS --out "$out/$apk_name" "$out/aligned.apk"
"$tools/apksigner" verify "$out/$apk_name"
