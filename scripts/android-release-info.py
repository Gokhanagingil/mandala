"""Record metadata for an aligned unsigned APK; the local signer checks its hash."""
from pathlib import Path
import hashlib, json, re, subprocess, sys
apk, badging = map(Path, sys.argv[1:3])
text = badging.read_text()
match = re.search(r"package: name='([^']+)' versionCode='(\d+)' versionName='([^']+)'", text)
if not match or match[1] != 'com.gokhanagingil.mangala':
    raise SystemExit('Unexpected release application identity')
permissions = re.findall(r"uses-permission: name='([^']+)'", text)
allowed = {'com.gokhanagingil.mangala.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION'}
if 'application-debuggable' in text or not set(permissions).issubset(allowed):
    raise SystemExit('Release must not be debuggable or request permissions')
value = {'applicationId': match[1], 'versionCode': int(match[2]), 'versionName': match[3],
         'debuggable': False, 'permissions': permissions, 'minimumAndroidSdk': 26,
         'unsignedSha256': hashlib.sha256(apk.read_bytes()).hexdigest(),
         'sourceCommit': subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip()}
apk.with_suffix('.json').write_text(json.dumps(value, indent=2) + '\n')
print(json.dumps(value))
