#!/usr/bin/env python3
"""Check the generated Play bundle and the manifest produced by the same build."""
from pathlib import Path
import hashlib
import json
import re
import sys
import xml.etree.ElementTree as ET
import zipfile

bundle=Path(sys.argv[1])
ns='{http://schemas.android.com/apk/res/android}'
with zipfile.ZipFile(bundle) as archive:
    assert archive.testzip() is None, 'Corrupt bundle'
    names=set(archive.namelist())
    for required in ['BundleConfig.pb','base/manifest/AndroidManifest.xml','base/dex/classes.dex']:
        assert required in names, f'Missing {required}'
    assert any(name.endswith('.SF') and name.startswith('META-INF/') for name in names), 'Unsigned bundle'

candidates=[p for p in Path('app/build/intermediates').rglob('AndroidManifest.xml') if 'playRelease' in p.parts and ('merged_manifests' in p.parts or 'merged_manifest' in p.parts)]
assert candidates, 'Merged Play manifest not found'
manifest=ET.parse(candidates[0]).getroot()
assert manifest.get('package')=='se.hangagbg.android', 'Wrong application ID'
permissions={element.get(ns+'name') for element in manifest.findall('uses-permission')}
assert 'android.permission.REQUEST_INSTALL_PACKAGES' not in permissions, 'APK installation permission in Play build'
assert 'android.permission.CAMERA' not in permissions, 'Unexpected camera permission'
assert int(manifest.find('uses-sdk').get(ns+'targetSdkVersion'))==36, 'Play target SDK must be 36'
assert any(s.get(ns+'name','').endswith('.ChatMessagingService') for s in manifest.findall('application/service')), 'FCM service missing'
assert any(p.get(ns+'name','').endswith('.ProfilePhotoProvider') and p.get(ns+'exported')=='false' for p in manifest.findall('application/provider')), 'Private photo provider missing'
source=Path('app/build.gradle').read_text()
version=re.search(r"versionName '([^']+)'",source).group(1)
code=int(re.search(r'versionCode (\d+)',source).group(1))
report={'applicationId':manifest.get('package'),'versionName':version,'versionCode':code,'targetSdk':36,'sha256':hashlib.sha256(bundle.read_bytes()).hexdigest(),'uploadCertificateSha256':sys.argv[2]}
bundle.with_name('HangaGBG-Play-info.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
