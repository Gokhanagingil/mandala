"""Exercise non-debuggable release builds before and after Android package update."""
from pathlib import Path
import json, subprocess, re

out = Path('native-qa')
package = 'com.gokhanagingil.mangala'
runner = package + '.test/androidx.test.runner.AndroidJUnitRunner'

def adb(*args):
    p = subprocess.run(['adb', *args], text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=300)
    print(p.stdout, flush=True)
    if p.returncode:
        raise SystemExit('adb failed: ' + args[0])
    return p.stdout

def install(path):
    if 'Success' not in adb('install', '-r', str(path)):
        raise SystemExit('Android rejected APK installation')

def instrument(name, selector, count):
    result = adb('shell', 'am', 'instrument', '-w', '-e', 'class', selector, runner)
    (out / (name + '.txt')).write_text(result)
    if not re.search(r'OK \(' + str(count) + r' tests?\)', result):
        raise SystemExit(name + ': instrumentation tests did not pass')

install(out / 'baseline.apk')
install(out / 'tests.apk')
instrument('before-update', package + '.UpgradeTest#seedBeforeUpdate', 1)
# No uninstall and no pm clear: this must preserve private WebView storage.
install(out / 'candidate.apk')
instrument('after-update', package + '.UpgradeTest#verifyAfterUpdate', 1)
instrument('release-gameplay', package + '.OfflineGameTest', 4)
(out / 'validation.json').write_text(json.dumps({
    'platform': 'Android 15 / API 35 emulator', 'applicationId': package,
    'buildType': 'release', 'debuggable': False, 'nativeTests': 6,
    'update': {'from': 14001, 'to': 14002, 'method': 'adb install -r',
               'preserved': ['game', 'career', 'puzzles', 'settings']},
    'signing': 'Ephemeral CI-only QA key; production key stays outside CI.',
}, indent=2) + '\n')
print('PASS: release installation, update preservation, and all 6 native tests')
