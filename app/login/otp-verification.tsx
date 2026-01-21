import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { hp, ms, rfs, wp } from "../../src/utils/responsive";

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
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={ms(24)} color="#084C7F" />
          </TouchableOpacity>
          
          <Image 
            source={require("../../src/assets/images/ash-logo-small.png")} 
            style={styles.logo} 
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>OTP sent{"\n"}to email</Text>
          <Text style={styles.subtitle}>Enter the OTP sent to your email.</Text>

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
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp(1.2),
    paddingHorizontal: wp(6.4),
  },
  backButton: {
    padding: ms(8),
    marginLeft: -8,
  },
  logo: {
    width: wp(22.9),
    height: hp(10.6),
    transform: [
      { translateX: wp(3.2)}, 
      { translateY: hp(-2)}  
    ],
  },
  formContainer: {
    width: "80%",
    alignSelf: "center",
    flex: 1,
    justifyContent: "center",
    paddingBottom: hp(9.9),
  },
  title: {
    fontSize: rfs(40),
    fontWeight: "900",
    color: "#0D253F",
    lineHeight: rfs(44),
    marginBottom: hp(1),
    textAlign: "left",
  },
  subtitle: {
    color: "#556677",
    fontSize: rfs(15),
    marginBottom: hp(4.9),
    textAlign: "left",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(1.5),
  },
  otpLine: {
    width: "14%",
    height: hp(0.25),
    backgroundColor: "#8899AA",
    opacity: 0.5,
  },
  resendWrap: {
    alignSelf: "flex-end",
    marginBottom: hp(3.7),
  },
  resendText: {
    color: "#334",
    fontSize: rfs(13),
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#084C7F",
    paddingVertical: hp(2),
    borderRadius: ms(12),
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
    fontSize: rfs(16),
  },
  footer: {
    alignItems: "center",
    paddingBottom: hp(2.5),
    paddingHorizontal: wp(5.3),
  },
  smallText: {
    color: "#556677",
    fontSize: rfs(11),
    opacity: 0.6,
    textAlign: "center",
  },
});
