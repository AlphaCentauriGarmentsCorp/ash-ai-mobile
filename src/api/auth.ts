import apiClient from './client';
import { LoginRequest, LoginResponse, RegisterRequest, User, VerifyOtpRequest } from './types';

export const authApi = {
  // Login for Ash app
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/login/ash', credentials);
    if (response.token) {
      await apiClient.setToken(response.token);
    }
    return response;
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
