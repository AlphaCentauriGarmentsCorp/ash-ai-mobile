import { EuphoriaScript_400Regular, useFonts } from '@expo-google-fonts/euphoria-script';
import { GreatVibes_400Regular } from '@expo-google-fonts/great-vibes';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import {
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_800ExtraBold
} from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';

import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Index() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false, tabBarStyle: { display: 'none' } });
  }, [navigation]);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const [fontsLoaded] = useFonts({
    GreatVibes_400Regular,
    Inter_400Regular,
    Inter_700Bold,
    EuphoriaScript_400Regular,
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_800ExtraBold
  });

  const handleLogin = () => {
    if (username === '' || password === '') {
      Alert.alert('Error', 'Please fill in both username and password.');
      return;
    }
    router.push('/dashboard'); 
  };

  const handleForgotPassword = () => {
    router.push('/login/forgot'); 
  };

  if (!fontsLoaded) return null;

  return (
    <LinearGradient
      colors={['#E0F4FB', '#9AD1F0', '#6FBBE8']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >

        {/* TOP LOGO SECTION */}
        <View style={[styles.topSection, { paddingTop: insets.top + 30 }]}>
          {!isKeyboardVisible && (
            <Image
              source={require('../../src/assets/images/ash-logo.png')}
              style={styles.logoImage}
            />
          )}
          {!isKeyboardVisible && (
            <Text style={styles.tagline}>Companion App</Text>
          )}
        </View>

        {/* BOTTOM FORM SECTION */}
        <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 30 }]}>
          <View style={styles.formContainer}>
            
            <View style={styles.textContainer}>
              <Text style={styles.welcomeTitle}>Welcome!</Text>
              <Text style={styles.welcomeSub}>Manage your tasks and production workflow with ease.</Text>
            </View>

            {/* Username */}
            <View style={styles.inputBox}>
              <Ionicons name="person" size={20} color="#999" style={styles.icon} />
              <TextInput
                placeholder="Username"
                placeholderTextColor="#999"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
              />
            </View>

            {/* Password */}
            <View style={styles.inputBox}>
              <Ionicons name="key" size={20} color="#999" style={styles.icon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
              <Ionicons name="eye-outline" size={20} color="#999" style={{ opacity: 0.7 }} />
            </View>
          
            {/* Checkbox & Forgot Password Row */}
            <View style={styles.row}>
              <Pressable 
                style={styles.checkboxWrapper} 
                onPress={() => setRememberMe(!rememberMe)}
                hitSlop={10} // Makes it easier to tap
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                  {rememberMe && <Ionicons name="checkmark" size={10} color="#093554" />}
                </View>
                <Text style={styles.smallLabel}>Remember me</Text>
              </Pressable>

              <TouchableOpacity 
                onPress={handleForgotPassword}
                hitSlop={15} // IMPORTANT: Increases clickable area
                style={{ padding: 5 }} // Adds visual padding
              >
                <Text style={styles.smallLabel}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
              <Text style={styles.loginBtnText}>Login</Text>
            </TouchableOpacity>

          </View>
        </View>

      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1, justifyContent: 'space-between' },
  
  topSection: {
    alignItems: 'center',
    paddingBottom: 20,
    flex: 1, // Allows logo to take up available space
    justifyContent: 'center',
  },
  logoImage: {
    width: 320,
    height: 320,
    resizeMode: 'contain',
  },
  tagline: {
    fontFamily: 'EuphoriaScript_400Regular',
    fontSize: 32,
    color: '#2C3E50',
    marginTop: -80, // Reduced negative margin
    opacity: 0.9,
  },
  
  bottomSection: {
    justifyContent: 'flex-end',
    paddingHorizontal: 35,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  textContainer: { marginBottom: 25 },
  welcomeTitle: {
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: 20,
    color: '#0B3048',
  },
  welcomeSub: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    color: '#2C3E50',
    opacity: 0.8,
  },
  
  inputBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 35, // Slightly taller for easier tapping
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    },
  icon: { marginRight: 12 },
  input: {
    flex: 1,
    fontFamily: 'poppins-regular',
    fontSize: 13,
    color: '#333',
    height: '110%',
    opacity: 1,

    
  },

  // --- FIXED ROW STYLES (No more negative margins!) ---
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 30, // Space between links and login button
    
  },
  checkboxWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center',
  },
  checkbox: {
    width: 10,
    height: 10,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    // Optional: Add background color when active if desired
  },
  smallLabel: {
    color: '#000000',
    fontSize: 9,
    fontFamily: 'poppins-regular',
    opacity: 0.95,
    marginRight: 10,
    
  },

  loginBtn: {
    backgroundColor: '#00437A',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    marginBottom: 50,
    marginTop: -5,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
});