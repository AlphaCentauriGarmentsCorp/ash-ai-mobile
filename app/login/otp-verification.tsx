import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
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

export default function Otp() {
  const router = useRouter();
  
  return (
    <LinearGradient
      colors={["#95BAD98C", "#31A0FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#084C7F" />
          </TouchableOpacity>
          
          <Image 
            source={require("../../assets/images/ash-logo-small.png")} 
            style={styles.logo} 
            resizeMode="contain"
          />
        </View>
        
        {/* Content Container: Constrained width (80%) to center everything */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>OTP sent{"\n"}to email</Text>
          <Text style={styles.subtitle}>Enter the OTP sent to your email.</Text>

          {/* OTP Lines */}
          <View style={styles.otpRow}>
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <View key={index} style={styles.otpLine} />
            ))}
          </View>

          <TouchableOpacity style={styles.resendWrap}>
            <Text style={styles.resendText}>Resend?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} activeOpacity={0.8}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.smallText}>
             © This 2FA process secures your account and company.
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 24,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },

  logo: {
    width: 86,
    height: 86,
    transform: [
      { translateX: 12}, 
      { translateY: -16}  
    ],
  },
  formContainer: {
    width: "80%",
    alignSelf: "center",
    flex: 1,
    justifyContent: "center",
    paddingBottom: 80,
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    color: "#0D253F",
    lineHeight: 44,
    marginBottom: 8,
    textAlign: "left",
  },
  subtitle: {
    color: "#556677",
    fontSize: 15,
    marginBottom: 40,
    textAlign: "left",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  otpLine: {
    width: "14%",
    height: 2,
    backgroundColor: "#8899AA",
    opacity: 0.5,
  },
  resendWrap: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  resendText: {
    color: "#334",
    fontSize: 13,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#084C7F",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  smallText: {
    color: "#556677",
    fontSize: 11,
    opacity: 0.6,
    textAlign: "center",
  },
});