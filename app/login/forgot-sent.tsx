import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
        <Ionicons name="arrow-back" size={24} color="#084C7F" />
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    justifyContent: "space-between" // Pushes content apart
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 16 : 16,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  
  // Center Section
  centerContainer: { 
    flex: 1, // Takes up all available space
    alignItems: "center", 
    justifyContent: "center", 
    paddingHorizontal: 40,
    paddingBottom: 50 // Nudges the visual center up slightly to match the eye-line
  },
  icon: { 
    width: 100, 
    height: 100, 
    marginBottom: 20,
  },
  emoji: {
    fontSize: 96,
    marginBottom: 12,
    textAlign: 'center',
  },
  title: { 
    fontSize: 26, 
    fontWeight: "900", 
    color: "#0D253F", 
    textAlign: "center", 
    marginBottom: 10,
    lineHeight: 32
  },
  subtitle: { 
    color: "#556677", 
    fontSize: 15, 
    textAlign: "center", 
    lineHeight: 22,
    maxWidth: "80%" // Prevents text from stretching too wide
  },

  // Bottom Section
  bottomContainer: {
    paddingHorizontal: 24, // Matches the side margins of the input fields in previous screens
    paddingBottom: 40, // Distance from bottom edge
    width: "100%",
  },
  continueButton: { 
    width: "100%", 
    backgroundColor: "#084C7F", 
    paddingVertical: 16, 
    borderRadius: 12, 
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
    fontSize: 17 
  },
});