import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { hp, ms, rfs, wp } from "../../src/utils/responsive";

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
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={ms(24)} color="#084C7F" />
        </TouchableOpacity>
        <View style={styles.logo}>
          <Image source={require("../../src/assets/images/ash-logo-small.png")} style={styles.logo} resizeMode="contain" />
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
            <Ionicons name="mail-outline" size={ms(20)} color="#6B7C93" style={styles.inputIcon} />
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
  },
  headerRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginTop: hp(1.2), 
    paddingHorizontal: wp(6.4),
    zIndex: 10, 
  },
  backButton: { 
    padding: ms(8),
    marginLeft: -8,
  },
  logo: {
    width: wp(22.9), 
    height: hp(10.6),
    transform: [
    { translateX: wp(3.2) }, 
    { translateY: hp(-1.5) }  
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
    fontSize: rfs(36), 
    fontWeight: "900", 
    color: "#0D253F", 
    lineHeight: rfs(40), 
    marginBottom: hp(1.2),
    textAlign: "left"
  },
  subtitle: { 
    color: "#556677", 
    fontSize: rfs(14), 
    marginBottom: hp(3.9), 
    textAlign: "left",
    lineHeight: rfs(20)
  },
  inputRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#fff", 
    borderRadius: ms(10), 
    height: hp(6.2), 
    paddingHorizontal: wp(3.7), 
    marginBottom: hp(2.5), 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 3, 
    elevation: 2 
  },
  inputIcon: { 
    marginRight: wp(2.7), 
    opacity: 0.6 
  },
  input: { 
    flex: 1, 
    fontSize: rfs(15), 
    color: "#111",
    height: "100%" 
  },
  submitButton: { 
    backgroundColor: "#084C7F", 
    height: hp(6.2), 
    borderRadius: ms(10), 
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
    fontSize: rfs(16) 
  },
});
