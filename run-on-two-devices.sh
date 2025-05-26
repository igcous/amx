#!/bin/bash
app_name=$(basename $(pwd))
echo "Running '$app_name' on two emulators"

# run 'npx expo run:android' first

#export NODE_ENV=production
#cd android && ./gradlew assembleDebug
#cd ..
#adb -s emulator-5554 install -r android/app/build/outputs/apk/debug/app-debug.apk
#adb -s emulator-5554 shell monkey -p com.igcous.$app_name -c android.intent.category.LAUNCHER 1
#
#cd android && ./gradlew assembleDebug
#adb -s emulator-5556 install -r android/app/build/outputs/apk/debug/app-debug.apk
#cd ..
#adb -s emulator-5556 shell monkey -p com.igcous.$app_name -c android.intent.category.LAUNCHER 1

adb -s emulator-5554 install -r android/app/build/outputs/apk/debug/app-debug.apk