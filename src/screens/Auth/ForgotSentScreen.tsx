import { hp, ms, rfs, wp } from "@utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotSentScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = (route: string) => {
    setIsLoading(true);
    setTimeout(() => {
      router.push(route as any);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <LinearGradient
      colors={['#E0F4FB', '#9AD1F0', '#6FBBE8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
      

      <View style={styles.centerContainer}>
        <Image source={require("../../assets/images/Envelope.png")} style={styles.icon} resizeMode="contain" />

        <Text style={styles.title}>E-mail successfully sent</Text>
        <Text style={styles.subtitle}>Reset link delivered to your email.</Text>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          activeOpacity={0.85}
          onPress={() => handleNavigation("/login/create-password")}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  safeArea: { 
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "space-between"
  },
  backButton: {
    position: "absolute",
    top: hp(2),
    left: wp(5.3),
    zIndex: 10,
    padding: ms(8),
  },
  centerContainer: { 
    flex: 1,
    alignItems: "center", 
    justifyContent: "center", 
    paddingHorizontal: wp(10.7),
    paddingBottom: hp(6.2)
  },
  icon: { 
    width: wp(26.7), 
    height: hp(12.3), 
    marginBottom: hp(2.5),
  },
  emoji: {
    fontSize: rfs(96),
    marginBottom: hp(1.5),
    textAlign: 'center',
  },
  title: { 
    fontSize: rfs(22), 
    fontFamily: "Poppins_700Bold", 
    color: "#032A4A", 
    textAlign: "center", 
    marginBottom: hp(1.2),
    lineHeight: rfs(32)
  },
  subtitle: { 
    color: "#032A4A", 
    fontSize: rfs(14), 
    fontFamily: "Poppins_300Light", 
    textAlign: "center", 
    lineHeight: rfs(22),
    maxWidth: "80%"
  },
  bottomContainer: {
    paddingHorizontal: wp(6.4),
    paddingBottom: hp(4.9),
    width: "100%",
  },
  continueButton: { 
    width: "85%", 
    backgroundColor: "#00437A",  
    borderRadius: ms(10), 
    alignItems: "center",
    height: 40,
    marginLeft:30,
    marginRight:30,
    marginBottom: 50, 
    marginTop: -50, 
  },
  continueText: { 
    color: "#fff", 
    fontWeight: "bold", 
    marginTop: 8,
    fontSize: rfs(17) 
  },
});
