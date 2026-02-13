import Constants from 'expo-constants';

// Get BASE_API_URL from environment variables
// For development, using hardcoded URL as fallback
const BASE_API_URL = 
  Constants.expoConfig?.extra?.BASE_API_URL || 
  process.env.BASE_API_URL || 
  'https://api.sorbetesapparel.com/api/v2';

console.log('API Config - BASE_URL:', BASE_API_URL);

const API_CONFIG = {
  BASE_URL: BASE_API_URL,
  TIMEOUT: 30000, // 30 seconds

  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/login',
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
    CLIENT_BY_ID: (id: number) => `/clients/${id}`,

    // Order endpoints
    ORDERS: '/orders',
    ORDER_BY_ID: (id: number) => `/orders/${id}`,

    // Dropdown settings endpoints
    DROPDOWN_SETTINGS: '/dropdown-settings',
    DROPDOWN_SETTING_BY_ID: (id: number) => `/dropdown-settings/${id}`,
  },
} as const;

export default API_CONFIG;
