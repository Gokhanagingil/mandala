# Mangala Android

The Android app bundles the exact `dist/` game and serves it through AndroidX
WebViewAssetLoader on a local HTTPS origin. It works offline from first launch,
without INTERNET or storage permissions. The Android build combines the unchanged
engine and AI modules into an in-memory Blob worker, because dedicated module-worker
requests do not reliably pass through WebViewAssetLoader. This keeps AI work off the
UI thread without adding network access or changing the web version. Career, settings and games use private
WebView storage. Portrait and landscape are supported; rotation keeps the current
WebView and move animation alive. Android Back closes dialogs, returns from a
board to its parent screen, then offers an exit confirmation.

## Requirements and build

Android 8.0+ with an up-to-date Android System WebView (Chromium 111+).
JDK 17, Gradle 8.13, Android SDK platform 36 and build tools 36.0.0.

```sh
npm run build
npm test
gradle -p android assembleDebug assembleRelease lintRelease
gradle -p android connectedDebugAndroidTest
```

The GitHub Android workflow performs these checks and tests offline play, the
AI worker, career progression, opponent selection, rotation, Back and saved game
recovery on an Android emulator before distributing an installable APK.

## Signing and app identity

`Mangala-1.4.0-preview.apk` is an installable **preview**, signed with the build
runner's temporary Android debug key. Its package is
`com.gokhanagingil.mangala.preview` and launcher label is **Mangala Deneme**.
It is separate from the future production package `com.gokhanagingil.mangala`.

A later preview built on a fresh runner may require uninstalling the old preview;
uninstalling removes local progress. Browser progress and production app progress
are separate too. This preview is for testing, not Play Store submission.
No signing private keys are committed, logged, uploaded or cached by this workflow.

The release variant remains unsigned until a permanent private signing key can be
securely provisioned. Do not distribute the unsigned APK as an installable release.
Before production: provision that key, back it up privately, add a secure release
signing process, and test on physical phones.
