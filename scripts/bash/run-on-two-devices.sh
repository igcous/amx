#!/bin/bash
cd ../..
app_name=$(basename $(pwd))
echo "Running '$app_name' on two emulators"

cd android && ./gradlew assembleDebug
cd ..
adb -s emulator-5554 install -r android/app/build/outputs/apk/release/app-release.apk
adb -s emulator-5554 shell monkey -p com.anonymous.$app_name -c android.intent.category.LAUNCHER 1

cd android && ./gradlew assembleDebug
adb -s emulator-5556 install -r android/app/build/outputs/apk/release/app-release.apk
cd ..
adb -s emulator-5556 shell monkey -p com.anonymous.$app_name -c android.intent.category.LAUNCHER 1
