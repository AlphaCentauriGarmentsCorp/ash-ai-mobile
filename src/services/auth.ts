import apiClient from '../api/client';
import API_CONFIG from '../api/config';
import { LoginRequest, LoginResponse, RegisterRequest, User, VerifyOtpRequest } from '../api/types';

class AuthService {
  // Main login (for Ash AI admin)
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.LOGIN,
      credentials
    );

    // Store token (Sanctum uses single token)
    await apiClient.setToken(response.token);

    return response;
  }

  // Reefer customer login
  async loginReefer(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.LOGIN_REEFER,
      credentials
    );

    await apiClient.setToken(response.token);
    return response;
  }

  // Sorbetes customer login
  async loginSorbetes(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.LOGIN_SORBETES,
      credentials
    );

    await apiClient.setToken(response.token);
    return response;
  }

  // Register Reefer customer
  async registerReefer(data: RegisterRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.REGISTER_REEFER,
      data
    );

    await apiClient.setToken(response.token);
    return response;
  }

  // Register Sorbetes customer
  async registerSorbetes(data: RegisterRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.REGISTER_SORBETES,
      data
    );

    await apiClient.setToken(response.token);
    return response;
  }

  // Verify OTP
  async verifyOtp(data: VerifyOtpRequest): Promise<void> {
    await apiClient.post(API_CONFIG.ENDPOINTS.VERIFY_OTP, data);
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_CONFIG.ENDPOINTS.LOGOUT);
    } finally {
      await apiClient.clearTokens();
    }
  }

  // Get current user (logged-in user info)
  async getCurrentUser(): Promise<User> {
    return await apiClient.get<User>(API_CONFIG.ENDPOINTS.ME);
  }

  // Check if authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await apiClient.getToken();
    return !!token;
  }
}

export const authService = new AuthService();
export default authService;
