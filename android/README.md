# Mangala Android · permanent release

Production application: `com.gokhanagingil.mangala` · launcher name: **Mangala**.
Version 1.4.1 uses versionCode 14002. Every future update must use this package,
a larger versionCode and the same private signing key. `release-identity.json`
and `release-certificate.pem` pin its public certificate; neither is secret.

The encrypted PKCS12 keystore and recovery information are backed up privately
for the owner. They must never enter git, CI logs, public releases or artifacts.
The signing script refuses missing keys, the wrong certificate, modified build
inputs, an old version code or private material placed inside the repository.
It never creates a replacement key automatically.

## Build, validate and sign

Requirements: Node 22+, JDK 17, Gradle 8.13, Android SDK 36/build-tools 36.0.0.

```sh
npm run build
npm test
gradle -p android assembleRelease assembleReleaseAndroidTest lintRelease -PandroidTestBuildType=release
```

The GitHub Android workflow builds aligned unsigned production APKs and performs
six native checks on Android 15: four full gameplay tests plus a real
`adb install -r` update from versionCode 14001 to 14002. The update must retain
an unfinished game, unlocked/selected rivals, solved puzzles, sound and speed.
Both QA packages use an ephemeral CI-only key; the permanent key stays outside CI.
The tested release is non-debuggable and does not request internet/storage access.

Download the successful `Mangala-1.4.1-release-inputs` artifact and sign locally:

```sh
python3 scripts/sign-android-release.py \
  /absolute/build/Mangala-1.4.1-unsigned.apk /absolute/output/Mangala-1.4.1.apk \
  --keystore /private/mangala-release.p12 \
  --password-file /private/keystore-password.txt \
  --apksigner /absolute/build/apksigner.jar
```

Keep the artifact's adjacent `.json` metadata beside the unsigned APK. The signer
checks input hash and permanent certificate, verifies v2/v3 signatures and confirms
that signing leaves every application payload file unchanged. Preserve the output
verification record and private backup. Before later releases, advance versionCode
and extend the upgrade baseline/expected version in `UpgradeTest.java` and workflow.

## Offline game and lifecycle

All `dist/` files are bundled, served from a local HTTPS WebViewAssetLoader origin.
Android combines the unchanged engine/AI into a Blob worker for reliable offline
background computation. No server or API is needed. Saves remain in private app
storage. Portrait and landscape are supported; rotation keeps the WebView alive.
Android Back closes the active dialog, returns to the parent screen, then confirms
exit. Android 8.0+ and an up-to-date Android System WebView (Chromium 111+) are needed.

## Previous preview

The earlier `com.gokhanagingil.mangala.preview` app is a separate application.
The permanent release installs beside it without uninstalling it. Browser and
preview saves are not automatically transferred to the permanent application.
After the first permanent installation, same-key upgrades preserve its saves;
uninstalling an app or clearing its data still deletes those saves.

CI validation is performed on an emulator; physical-phone testing remains separate.
