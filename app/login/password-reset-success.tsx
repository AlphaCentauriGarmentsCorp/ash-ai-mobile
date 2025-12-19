import { Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Image,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function PasswordResetSuccess() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  let [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });

  const handleNavigation = (route: string) => {
    setIsLoading(true);
    setTimeout(() => {
      router.push(route as any);
      setIsLoading(false);
    }, 1000);
  };

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }

  return (
    <LinearGradient
      colors={["#95BAD98C", "#31A0FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
      <View style={styles.contentContainer}>
        <Image
          source={require("../../assets/images/GreenCheck.png")}
          style={styles.iconImage}
          resizeMode="contain"
        />

        <Text style={styles.title}>Password reset{`\n`}successful</Text>
        <Text style={styles.subtitle}>You can now log in with your new password.</Text>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          activeOpacity={0.85}
          onPress={() => handleNavigation("/login")}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  bottomContainer: {
    paddingHorizontal: 28,
    paddingBottom: 30,
    width: "100%",
  },
  iconImage: { 
    width: 72, 
    height: 72, 
    marginBottom: 24 
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    color: "#0D253F",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    color: "#556677",
    fontSize: 14,
    textAlign: "center",
  },
  continueButton: {
    width: "100%",
    backgroundColor: "#084C7F",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  continueText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});