import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Image,
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

export default function Index() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isChecked, setChecked] = useState(false);

  const handleLogin = () => {
    // For testing, navigate directly to dashboard
    // router.push("/login/otp-verification" as any);
    router.push("/dashboard" as any);
  };

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };
  
  const [fontsLoaded] = useFonts({
    'EuphoriaScript': require('../../assets/fonts/EuphoriaScript-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#084C7F" />
      </View>
    );
  }

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
        {/* Logo Section */}
        <View style={styles.logoWrap}>
          <Image
            source={require("../../assets/images/ash-logo.png")} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appSubtitle}>Companion App</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formWrap}>
          <Text style={styles.welcome}>Welcome!</Text>
          <Text style={styles.caption}>
            Manage your tasks and production workflow with ease.
          </Text>

          {/* Username Input */}
          <View style={styles.inputRow}>
            <Ionicons name="person" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              placeholder="Username"
              placeholderTextColor="#999"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputRow}>
            <Ionicons name="key" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!isPasswordVisible}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable onPress={() => setPasswordVisible(!isPasswordVisible)}>
              <Ionicons 
                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#999" 
              />
            </Pressable>
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.rowBetween}>
            <Pressable 
              style={styles.rememberRow} 
              onPress={() => setChecked(!isChecked)}
            >
              <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                  {isChecked && <Ionicons name="checkmark" size={12} color="#fff" />}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </Pressable>
            
            <TouchableOpacity onPress={() => handleNavigation("/login/forgot") }>
              <Text style={styles.forgot}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            activeOpacity={0.8}
            onPress={handleLogin}
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  keyboardView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between", 
    paddingBottom: 30, 
  },
  logoWrap: {
    alignItems: "center",
    justifyContent: 'center',
    flex: 1, 
    marginTop: -20, 
  },
  logo: {
    width: 420, 
    height: 380,
    marginBottom: -70,
  },
  appSubtitle: {
    color: "#4a5b6c",
    fontSize: 32, 
    fontFamily: 'EuphoriaScript',
    marginTop: -10,
  },
  formWrap: {
    width: "88%",
    marginBottom: 20,
  },
  welcome: {
    fontSize: 28,
    fontFamily: "Poppins_700Bold", 
    color: "#1A2B3C",
    marginBottom: 8,
    textAlign: "left",
  },
  caption: {
    color: "#556677",
    fontSize: 14,
    fontFamily: "Poppins_300Light", 
    marginBottom: 32, 
    lineHeight: 20,
    textAlign: "left",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10, 
    marginBottom: 34, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#8E909B",
  },
  inputIcon: {
    marginRight: 10,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111",
    fontFamily: "Poppins_400Regular",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 4, 
    paddingHorizontal: 2,
  },
  rememberRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#889",
    backgroundColor: "#fff",
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: "#084C7F",
    borderColor: "#4CA9FA",
  },
  rememberText: { 
    color: "#334", 
    fontSize: 12, 
    fontFamily: "Poppins_400Regular",
  },
  forgot: { 
    color: "#334",
    fontSize: 12, 
    fontFamily: "Poppins_400Regular",
  },
  loginButton: {
    backgroundColor: "#084C7F",
    paddingVertical: 12, 
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loginText: { 
    color: "#fff", 
    fontSize: 18, 
    fontFamily: "Poppins_700Bold",
  },
});