import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function CreatePassword() {
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
      colors={["#95BAD98C", "#31A0FF"]}
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
            {/* New Password Input */}
            <View style={styles.inputRow}>
              <Ionicons name="key" size={20} color="#8899A6" style={styles.inputIcon} />
              <TextInput
                placeholder="New password"
                placeholderTextColor="#8899A6"
                secureTextEntry={!isPasswordVisible}
                style={styles.input}
              />
              <Pressable onPress={() => setPasswordVisible(!isPasswordVisible)}>
                <Ionicons 
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#8899A6" 
                />
              </Pressable>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputRow}>
              <Ionicons name="key" size={20} color="#8899A6" style={styles.inputIcon} />
              <TextInput
                placeholder="Confirm new password"
                placeholderTextColor="#8899A6"
                secureTextEntry={!isConfirmVisible}
                style={styles.input}
              />
              <Pressable onPress={() => setConfirmVisible(!isConfirmVisible)}>
                <Ionicons 
                  name={isConfirmVisible ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#8899A6" 
                />
              </Pressable>
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
    backgroundColor: "transparent", // Ensures the gradient from _layout.tsx shows
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 
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
    marginBottom: 30,
  },
  title: { 
    fontSize: 34, 
    fontFamily: "Poppins_700Bold", // Applied Poppins
    color: "#0D253F",
    lineHeight: 40, 
    marginBottom: 8,
    textAlign: 'left',
  },
  subtitle: { 
    color: "#556677", 
    fontSize: 14, 
    fontFamily: "Poppins_400Regular", // Applied Poppins
    lineHeight: 20,
    textAlign: 'left',
  },
  form: {
    width: '100%',
  },
  inputRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#fff", 
    borderRadius: 12,
    paddingHorizontal: 14, 
    paddingVertical: 14, 
    marginBottom: 16, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 3, 
    elevation: 2,
  },
  inputIcon: { 
    marginRight: 12, 
  },
  input: { 
    flex: 1, 
    fontSize: 16, 
    color: "#111",
    fontFamily: "Poppins_400Regular", // Applied Poppins
  },
  submitButton: { 
    backgroundColor: "#084C7F", 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: "center", 
    marginTop: 10,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 4,
  },
  submitText: { 
    color: "#fff", 
    fontFamily: "Poppins_700Bold", // Applied Poppins
    fontSize: 16 
  },
});