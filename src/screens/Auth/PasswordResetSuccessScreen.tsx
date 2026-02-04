import { Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { hp, ms, rfs, wp } from "@utils/responsive";
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

export default function PasswordResetSuccessScreen() {
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
      colors={['#E0F4FB', '#9AD1F0', '#6FBBE8']}
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
    fontSize: rfs(32),
    fontFamily: "Poppins_700Bold",
    color: "#032A4A",
    textAlign: "center",
    marginBottom: hp(1.5),
  },
  subtitle: {
    color: "#032A4A",
    fontSize: rfs(14),
    marginBottom: 20,
    marginTop: -20,
    textAlign: "center",
  },
  continueButton: {
    width: "85%", 
    backgroundColor: "#00437A",
    borderRadius: ms(12),
    alignItems: "center",
    marginLeft:30,
    marginRight:30,
    marginBottom: 50, 
    marginTop: -50, 
    height: 40
  },
  continueText: { 
    color: "#fff", 
    fontFamily: "Poppins_700Bold",
    marginTop: hp(1), 
    fontSize: rfs(16) 
  },
});
