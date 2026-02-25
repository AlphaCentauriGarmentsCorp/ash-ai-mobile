import apiClient from './client';
import API_CONFIG from './config';
import { LoginRequest, LoginResponse, RegisterRequest, User, VerifyOtpRequest } from './types';

export const authApi = {
  // Login for Ash app
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<any>(API_CONFIG.ENDPOINTS.LOGIN, credentials);
    
    console.log('Login response:', response);

    // Handle response - might be a string with HTML warnings + JSON
    let loginData = response.data || response;
    
    // If response is a string (contains HTML warnings), extract JSON
    if (typeof loginData === 'string') {
      console.log('Response is a string, extracting JSON...');
      // Find the JSON part (starts with { and ends with })
      const jsonMatch = loginData.match(/\{.*\}/s);
      if (jsonMatch) {
        try {
          loginData = JSON.parse(jsonMatch[0]);
          console.log('Parsed JSON:', loginData);
        } catch (e) {
          console.error('Failed to parse JSON from response:', e);
          throw new Error('Invalid response format from server');
        }
      } else {
        console.error('No JSON found in response');
        throw new Error('Invalid response format from server');
      }
    }
    
    const token = loginData.token || loginData.access_token;
    const user = loginData.user;

    if (!token) {
      console.error('No token in login response:', loginData);
      throw new Error('No authentication token received');
    }

    if (token) {
      await apiClient.setToken(token);
    }
    
    return {
      token,
      user,
      message: loginData.message
    };
  },

  // Register
  register: async (data: RegisterRequest): Promise<{ message: string; user: User }> => {
    return await apiClient.post('/register', data);
  },

  // Verify OTP
  verifyOtp: async (data: VerifyOtpRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/verify-otp', data);
    if (response.token) {
      await apiClient.setToken(response.token);
    }
    return response;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      // Ignore logout errors, just clear tokens
      console.log('Logout request failed, clearing tokens anyway');
    } finally {
      await apiClient.clearTokens();
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    return await apiClient.get<User>('/me');
  },

  // Refresh token (if needed)
  refreshToken: async (): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/refresh');
    if (response.token) {
      await apiClient.setToken(response.token);
    }
    return response;
  },
};
