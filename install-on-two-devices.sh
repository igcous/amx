#!/bin/bash
app_name=$(basename $(pwd))

echo "Assembling '$app_name' release build..."
cd android
./gradlew assembleRelease

echo "Installing '$app_name' on two emulators..."
cd ..
adb -s emulator-5554 install -r android/app/build/outputs/apk/release/app-release.apk
adb -s emulator-5556 install -r android/app/build/outputs/apk/release/app-release.apk