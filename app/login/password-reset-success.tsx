import { Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { hp, ms, rfs, wp } from "../../src/utils/responsive";

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
          source={require("../../src/assets/images/GreenCheck.png")}
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
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(7.5),
  },
  bottomContainer: {
    paddingHorizontal: wp(7.5),
    paddingBottom: hp(3.7),
    width: "100%",
  },
  iconImage: { 
    width: wp(19.2), 
    height: hp(8.9), 
    marginBottom: hp(3) 
  },
  title: {
    fontSize: rfs(24),
    fontFamily: "Poppins_700Bold",
    color: "#0D253F",
    textAlign: "center",
    marginBottom: hp(1.5),
  },
  subtitle: {
    color: "#556677",
    fontSize: rfs(14),
    textAlign: "center",
  },
  continueButton: {
    width: "100%",
    backgroundColor: "#084C7F",
    paddingVertical: hp(2),
    borderRadius: ms(12),
    alignItems: "center",
  },
  continueText: { color: "#fff", fontWeight: "700", fontSize: rfs(16) },
});
