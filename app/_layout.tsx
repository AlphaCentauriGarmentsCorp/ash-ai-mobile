import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { usePoppinsFonts } from '../hooks';

export default function RootLayout() {
  usePoppinsFonts();

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0a2540" translucent={false} />
      <LinearGradient
        colors={["#95BAD98C", "#31A0FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
      </LinearGradient>
    </SafeAreaProvider>
  );
}