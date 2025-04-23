#!/bin/bash
echo "Creating custom project with name '$1'"
npx create-expo-app $1 --template blank-typescript
cd ./$1
pwd

#######################################
# INSTALLS
npx expo install expo-router expo-linking expo-constants expo-status-bar expo-system-ui expo-image expo-image-picker expo-web-browser expo-document-picker
npx expo install react-native-reanimated react-native-screens react-native-safe-area-context react-native-keyboard-controller
npx expo install firebase
# note: this is firebase JS, not firebase native (just works and more docs)
npx expo install react-native-gesture-handler
npx expo install react-native-gifted-chat@2.6.5
# note: this is the last gifted chat version that works with expo go but it doesnt make an android build. update it to build (2.8.1 works fine)
npx expo install @react-native-async-storage/async-storage
# note: i do not use async storage but it may be a dependency from other

#######################################
# SETUP
# expo-router
echo $(cat package.json | jq '.main = "expo-router/entry"') > package.json
echo $(cat app.json | jq '.expo.scheme = "my-app-scheme"') > app.json

#######################################
# MANUAL CONFIG FILES
npx expo customize babel.config.js
echo 'module.exports = function (api) {
	api.cache(true);
	return {
		presets: ["babel-preset-expo"],
		plugins: ["react-native-reanimated/plugin"],
	};
};
' > babel.config.js

npx expo customize metro.config.js
echo 'const { getDefaultConfig } = require("@expo/metro-config");
const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push("cjs");
module.exports = defaultConfig;
' > metro.config.js

#######################################
# TEMPLATE FILES
# cp -a ../templateFiles/. ./