import { Ionicons } from "@expo/vector-icons";
import { hp, ms, rfs, wp } from "@utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreatePasswordScreen() {
  const router = useRouter();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmVisible, setConfirmVisible] = useState(false);
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
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Create your{"\n"}new password</Text>
            <Text style={styles.subtitle}>Set a new password to complete the reset.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputRow}>
              <Ionicons name="key" size={ms(15)} color="#B3B3B3" style={styles.inputIcon} />
              <TextInput
                placeholder="New password"
                placeholderTextColor="#8899A6"
                style={styles.input}
              />
              
            </View>

            <View style={styles.inputRow}>
              <Ionicons name="key" size={ms(15)} color="#B3B3B3" style={styles.inputIcon} />
              <TextInput
                placeholder="Confirm new password"
                placeholderTextColor="#8899A6"
                style={styles.input}
              />
              
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              activeOpacity={0.85}
              onPress={() => handleNavigation("/login/password-reset-success")}
            >
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: "transparent",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
  },
  content: { 
    width: "88%", 
    alignSelf: "center",
  },
  header: {
    marginBottom: hp(3.7),
  },
  title: { 
    fontSize: rfs(38), 
    fontFamily: "Poppins_700Bold",
    color: "#032A4A",
    lineHeight: rfs(40), 
    marginBottom: hp(1),
    textAlign: 'left',
  },
  subtitle: { 
    color: "#032A4A", 
    fontSize: rfs(12), 
    fontFamily: "Poppins_300Light",
    lineHeight: rfs(20),
    textAlign: 'left',
  },
  form: {
    width: '100%',
  },
  inputRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#fff", 
    borderRadius: 10,
    paddingHorizontal: wp(3.7), 
    marginBottom: hp(3), 
    marginTop: hp(1), 
    height: 40, 
  },
  inputIcon: { 
    marginRight: wp(3.2), 
  },
  input: { 
    fontSize: 12, 
    fontFamily: "Poppins_300Light", 
    color: "#B3B3B3",
    marginBottom: -5,
  },
  submitButton: { 
    backgroundColor: "#00437A", 
    borderRadius: 10, 
    alignItems: "center", 
    marginBottom: hp(3), 
    marginTop: hp(4), 
    height: 40, 
    width: "85%", 
    marginLeft:20,
    marginRight:20,

  },
  submitText: { 
    color: "#fff", 
    fontFamily: "Poppins_700Bold",
    marginTop: hp(1), 
    fontSize: rfs(16) 
  },
});
