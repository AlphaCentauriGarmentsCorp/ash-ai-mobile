require('dotenv').config();

module.exports = {
  expo: {
    name: "Ash-Ai",
    slug: "Ash-Ai",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/images/ash-logo.png",
    scheme: "ashai",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    androidStatusBar: {
      barStyle: "light-content",
      backgroundColor: "#0a2540",
      translucent: false
    },
    ios: {
      supportsTablet: true,
      statusBarStyle: "light"
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./src/assets/images/ash-logo.png"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.joe1724.ashai"
    },
    web: {
      output: "static",
      favicon: "./src/assets/images/ash-logo.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./src/assets/images/ash-logo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#0a2540",
          dark: {
            backgroundColor: "#0a2540"
          }
        }
      ],
      "expo-font"
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "d59d1caa-d04a-4386-8446-168f6f1633f4"
      },
      // Load from environment variables
      API_URL: process.env.API_URL || 'http://127.0.0.1:8000/api/v2',
      STORAGE_BASE_URL: process.env.API_BASE_URL || 'http://127.0.0.1:8000'
    }
  }
};
