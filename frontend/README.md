# Setup Instructions:

1. cd into umami/frontend
2. start server with `npx react-native start`
3. open a new cli window in the same folder

## iOS:

4. run `npx react-native run-ios`

* For Debugging - cd into ios and run `pod install` and try again

## Android: 

4. run `npx react-native run-android`

* For Debugging - check env paths!
`export ANDROID_HOME=/Users/{yourusername}/Library/Android/sdk
export PATH=$ANDROID_HOME/platform-tools:$PATH
export PATH=$ANDROID_HOME/tools:$PATH`

## Alternative

### iOS:
1. open umami/frontend/ios/umami.xcworkspace in xcode
2. run using the play button in xcode

### Android:
1. open umami/frontend/android in android studios
2. run using the play button in android studios

#### NOTES
- Might have to run `adb reverse tcp:8080 tcp:8080` to map local machine and emulator port to 8080
so you can access local api at port 8080

