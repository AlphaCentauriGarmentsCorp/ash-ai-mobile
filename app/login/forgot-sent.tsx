import { Ionicons } from "@expo/vector-icons";
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
import { hp, ms, rfs, wp } from "../../utils/responsive";

export default function ForgotSent() {
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
      colors={["#95BAD98C", "#31A0FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={ms(24)} color="#084C7F" />
      </TouchableOpacity>

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
  
  // Center Section
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
    fontSize: rfs(26), 
    fontWeight: "900", 
    color: "#0D253F", 
    textAlign: "center", 
    marginBottom: hp(1.2),
    lineHeight: rfs(32)
  },
  subtitle: { 
    color: "#556677", 
    fontSize: rfs(15), 
    textAlign: "center", 
    lineHeight: rfs(22),
    maxWidth: "80%"
  },

  // Bottom Section
  bottomContainer: {
    paddingHorizontal: wp(6.4),
    paddingBottom: hp(4.9),
    width: "100%",
  },
  continueButton: { 
    width: "100%", 
    backgroundColor: "#084C7F", 
    paddingVertical: hp(2), 
    borderRadius: ms(12), 
    alignItems: "center",
    shadowColor: "#084C7F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  continueText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: rfs(17) 
  },
});