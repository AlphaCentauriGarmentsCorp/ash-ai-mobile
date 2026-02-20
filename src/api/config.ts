import Constants from 'expo-constants';

// Get API_URL from expo constants (loaded from .env via app.config.js)
const API_URL = Constants.expoConfig?.extra?.API_URL;

// Get STORAGE_BASE_URL from expo constants (loaded from .env via app.config.js)
const STORAGE_BASE_URL = Constants.expoConfig?.extra?.STORAGE_BASE_URL;

// Validate that URLs are configured
if (!API_URL) {
  console.error('❌ API_URL is not configured. Please check your .env file and restart the app.');
  console.error('Expected: API_URL=https://your-api-domain.com/api/v2');
}
if (!STORAGE_BASE_URL) {
  console.error('❌ STORAGE_BASE_URL is not configured. Please check your .env file and restart the app.');
  console.error('Expected: API_BASE_URL=https://your-api-domain.com');
}

console.log('✅ API Config - API_URL:', API_URL);
console.log('✅ API Config - STORAGE_BASE_URL:', STORAGE_BASE_URL);

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
    CLIENT_BY_ID: (id: number) => `/client/${id}`, // Singular for fetching single client
    CLIENT_UPDATE: (id: number) => `/client/${id}`, // For updating client
    CLIENT_DELETE: (id: number) => `/client/${id}`, // For deleting client

    // Order endpoints
    ORDERS: '/orders',
    ORDER_BY_ID: (id: number) => `/orders/${id}`,

    // Dropdown settings endpoints
    DROPDOWN_SETTINGS: '/dropdown-settings',
    DROPDOWN_SETTING_BY_ID: (id: number) => `/dropdown-settings/${id}`,
  },
} as const;

export default API_CONFIG;
