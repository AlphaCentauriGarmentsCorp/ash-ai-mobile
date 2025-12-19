import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Forgot() {
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
      {/* Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#084C7F" />
        </TouchableOpacity>
        <View style={styles.logo}>
          <Image source={require("../../assets/images/ash-logo-small.png")} style={styles.logo} resizeMode="contain" />
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.contentContainer}
      >
        <View style={styles.formWrapper}>
          <Text style={styles.title}>Forgot your{"\n"}password?</Text>
          <Text style={styles.subtitle}>Provide your email to get a reset link.</Text>

          <View style={styles.inputRow}>
            <Ionicons name="mail-outline" size={20} color="#6B7C93" style={styles.inputIcon} />
            <TextInput 
              placeholder="Your e-mail" 
              placeholderTextColor="#6B7C93" 
              style={styles.input} 
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            activeOpacity={0.85}
            onPress={() => handleNavigation('/login/forgot-sent')}
          >
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 
  },
  headerRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginTop: 10, 
    paddingHorizontal: 24,
    zIndex: 10, 
  },
  backButton: { 
    padding: 8,
    marginLeft: -8 
  },
  logo: {
    
    width: 86, 
    height: 86,
    transform: [
    { translateX: 12 }, 
    { translateY: -12 }  
  ],
  },
  contentContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
  },
  formWrapper: {
    width: "82%", 
  },
  title: { 
    fontSize: 36, 
    fontWeight: "900", 
    color: "#0D253F", 
    lineHeight: 40, 
    marginBottom: 10,
    textAlign: "left"
  },
  subtitle: { 
    color: "#556677", 
    fontSize: 14, 
    marginBottom: 32, 
    textAlign: "left",
    lineHeight: 20
  },
  inputRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    height: 50, 
    paddingHorizontal: 14, 
    marginBottom: 20, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 3, 
    elevation: 2 
  },
  inputIcon: { 
    marginRight: 10, 
    opacity: 0.6 
  },
  input: { 
    flex: 1, 
    fontSize: 15, 
    color: "#111",
    height: "100%" 
  },
  submitButton: { 
    backgroundColor: "#084C7F", 
    height: 50, 
    borderRadius: 10, 
    alignItems: "center", 
    justifyContent: "center",
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 4 
  },
  submitText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16 
  },
});