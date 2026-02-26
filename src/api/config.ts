import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Get API_URL from expo constants (loaded from .env via app.config.js)
let API_URL = Constants.expoConfig?.extra?.API_URL;

// Get STORAGE_BASE_URL from expo constants (loaded from .env via app.config.js)
let STORAGE_BASE_URL = Constants.expoConfig?.extra?.STORAGE_BASE_URL;

// Fix localhost for Android emulator
// Android emulator uses 10.0.2.2 to access host machine's localhost
if (Platform.OS === 'android') {
  if (API_URL?.includes('127.0.0.1') || API_URL?.includes('localhost')) {
    API_URL = API_URL.replace('127.0.0.1', '10.0.2.2').replace('localhost', '10.0.2.2');
    console.log('🔧 Android detected: Converted API_URL to use 10.0.2.2');
  }
  if (STORAGE_BASE_URL?.includes('127.0.0.1') || STORAGE_BASE_URL?.includes('localhost')) {
    STORAGE_BASE_URL = STORAGE_BASE_URL.replace('127.0.0.1', '10.0.2.2').replace('localhost', '10.0.2.2');
    console.log('🔧 Android detected: Converted STORAGE_BASE_URL to use 10.0.2.2');
  }
}

// Validate that URLs are configured
if (!API_URL) {
  console.error('❌ API_URL is not configured. Please check your .env file and restart the app.');
  console.error('Expected: API_URL=http://127.0.0.1:8000/api/v2');
  console.error('Make sure to:');
  console.error('1. Create a .env file in the root directory');
  console.error('2. Add API_URL=http://127.0.0.1:8000/api/v2');
  console.error('3. Restart the Expo development server (stop and run npm start again)');
}
if (!STORAGE_BASE_URL) {
  console.error('❌ STORAGE_BASE_URL is not configured. Please check your .env file and restart the app.');
  console.error('Expected: API_BASE_URL=http://127.0.0.1:8000');
}

console.log('✅ API Config - API_URL:', API_URL);
console.log('✅ API Config - STORAGE_BASE_URL:', STORAGE_BASE_URL);

// Throw error if critical config is missing
if (!API_URL || !STORAGE_BASE_URL) {
  throw new Error('Missing required API configuration. Check console for details.');
}

const API_CONFIG = {
  BASE_URL: API_URL, // For API requests
  STORAGE_BASE_URL: STORAGE_BASE_URL, // For storage/assets (images, files, etc.)
  TIMEOUT: 30000, // 30 seconds

  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/login/ash',
    LOGIN_REEFER: '/login/reefer',
    LOGIN_SORBETES: '/login/sorbetes',
    REGISTER_REEFER: '/register/reefer',
    REGISTER_SORBETES: '/register/sorbetes',
    VERIFY_OTP: '/verify-otp',
    LOGOUT: '/logout',
    ME: '/me', // Get logged-in user information

    // Account endpoints
    EMPLOYEES: '/employee',
    EMPLOYEE_BY_ID: (id: number) => `/employee/${id}`,

    // Client endpoints
    CLIENTS: '/clients',
    CLIENT_BY_ID: (id: number) => `/clients/${id}`, // Singular for fetching single client
    CLIENT_UPDATE: (id: number) => `/clients/${id}`, // For updating client
    CLIENT_DELETE: (id: number) => `/clients/${id}`, // For deleting client

    // Order endpoints
    ORDERS: '/orders',
    ORDER_BY_ID: (id: number) => `/orders/${id}`,

    // Dropdown settings endpoints
    DROPDOWN_SETTINGS: '/dropdown-settings',
    DROPDOWN_SETTING_BY_ID: (id: number) => `/dropdown-settings/${id}`,
  },
} as const;

export default API_CONFIG;
