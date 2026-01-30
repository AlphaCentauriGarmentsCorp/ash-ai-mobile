import { Ionicons } from "@expo/vector-icons";
import { hp, ms, rfs, wp } from "@utils/responsive";
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

export default function ForgotPasswordScreen() {
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
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={ms(24)} color="#084C7F" />
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
            <Ionicons name="mail-open-outline" size={ms(20)} color="#B3B3B3" style={styles.inputIcon} />
            <TextInput 
              placeholder="Your e-mail" 
              placeholderTextColor="#B3B3B3" 
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
    marginTop: 7,
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
    fontSize: 45, 
    fontFamily: "Poppins_800ExtraBold",
    color: "#032A4A", 
    lineHeight: rfs(55), 
    marginBottom: 130,
    marginTop: -130,
    textAlign: "left"
  },
  subtitle: { 
    color: "#032A4A", 
    fontSize: rfs(14), 
    fontFamily: "Poppins_200ExtraLight",
    marginBottom: 120, 
    marginTop: -120,
    textAlign: "left",
    lineHeight: rfs(20)
  },
  inputRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    height: 35, 
    paddingHorizontal: wp(3.7), 
    marginBottom: 70, 
    marginTop: -70, 
  },
  inputIcon: { 
    marginRight: wp(2.7), 
    opacity: 0.6 
  },
  input: { 
    flex: 1, 
    fontSize: 12, 
    fontFamily: "Poppins_200ExtraLight", 
    color: "#111",
    marginBottom: -5,
    
  },
  submitButton: { 
    backgroundColor: "#00437A", 
    height: 40, 
    borderRadius: 10, 
    alignItems: "center", 
    justifyContent: "center",
    marginLeft:25,
    marginRight:25,
    marginBottom: 30, 
    marginTop: -30, 
        width: "85%", 


  },
  submitText: { 
    color: "#fff", 
   fontFamily: "Poppins_700Bold", 
    marginBottom: -5,
    fontSize: rfs(16) 
  },
});
