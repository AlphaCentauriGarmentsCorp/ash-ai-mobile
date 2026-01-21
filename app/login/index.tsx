import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Checkbox from "../../src/components/common/Checkbox";
import FormInput from "../../src/components/common/FormInput";
import { hp, ms, rfs, wp } from "../../src/utils/responsive";

export default function Index() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setChecked] = useState(false);

  const handleLogin = () => {
    router.push("/dashboard" as any);
  };

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };
  
  const [fontsLoaded] = useFonts({
    'EuphoriaScript': require('../../src/assets/fonts/EuphoriaScript-Regular.ttf'),
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
        <View style={styles.logoWrap}>
          <Image
            source={require("../../src/assets/images/ash-logo.png")} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appSubtitle}>Companion App</Text>
        </View>

        <View style={styles.formWrap}>
          <Text style={styles.welcome}>Welcome!</Text>
          <Text style={styles.caption}>
            Manage your tasks and production workflow with ease.
          </Text>

          <FormInput
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            leftIcon="person"
            autoCapitalize="none"
            iconSize={ms(20)}
            containerStyle={styles.inputRow}
            inputStyle={styles.input}
          />

          <FormInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            leftIcon="key"
            isPassword={true}
            iconSize={ms(20)}
            containerStyle={styles.inputRow}
            inputStyle={styles.input}
          />

          <View style={styles.rowBetween}>
            <Checkbox
              checked={isChecked}
              onPress={() => setChecked(!isChecked)}
              label="Remember me"
              size={ms(18)}
              checkedColor="#084C7F"
              borderColor="#889"
              checkmarkSize={ms(12)}
              containerStyle={styles.rememberRow}
            />
            
            <TouchableOpacity onPress={() => handleNavigation("/login/forgot") }>
              <Text style={styles.forgot}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

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
  },
  keyboardView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between", 
    paddingBottom: hp(3.7), 
  },
  logoWrap: {
    alignItems: "center",
    justifyContent: 'center',
    flex: 1, 
    marginTop: hp(-2.5), 
  },
  logo: {
    width: wp(112), 
    height: hp(46.8),
    marginBottom: hp(-8.6),
  },
  appSubtitle: {
    color: "#4a5b6c",
    fontSize: rfs(32), 
    fontFamily: 'EuphoriaScript',
    marginTop: hp(-1.2),
  },
  formWrap: {
    width: "88%",
    marginBottom: hp(2.5),
  },
  welcome: {
    fontSize: rfs(28),
    fontFamily: "Poppins_700Bold", 
    color: "#1A2B3C",
    marginBottom: hp(1),
    textAlign: "left",
  },
  caption: {
    color: "#556677",
    fontSize: rfs(14),
    fontFamily: "Poppins_300Light", 
    marginBottom: hp(3.9), 
    lineHeight: rfs(20),
    textAlign: "left",
  },
  inputRow: {
    marginBottom: hp(4.2),
  },
  input: {
    fontSize: rfs(16),
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(3),
    marginTop: hp(0.5), 
    paddingHorizontal: wp(0.5),
  },
  rememberRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  forgot: { 
    color: "#334",
    fontSize: rfs(12), 
    fontFamily: "Poppins_400Regular",
  },
  loginButton: {
    backgroundColor: "#084C7F",
    paddingVertical: hp(1.5), 
    borderRadius: ms(12),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loginText: { 
    color: "#fff", 
    fontSize: rfs(18), 
    fontFamily: "Poppins_700Bold",
  },
});
