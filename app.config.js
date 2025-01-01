export default {
  "expo": {
    "name": "campus",
    "slug": "campus-security",
    "android": {
      "package": "com.schoolproj.campus",
      "googleServicesFile": process.env.GOOGLE_SERVICES_JSON || "./config/firebase/google-services.json",
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION"
      ]
    },
    "scheme": "acme",
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
          "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
          "recordAudioAndroid": true
        }
      ],
      [
        "expo-video",
        {
          "supportsBackgroundPlayback": true,
          "supportsPictureInPicture": false
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location."
        }
      ],
      "expo-asset",
      "@react-native-google-signin/google-signin"
    ],
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "c7aef051-0dc0-449d-aa70-b5724a7ba81f"
      }
    },
    "owner": "teez92"
  }
}
