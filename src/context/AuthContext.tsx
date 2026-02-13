import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/auth';
import apiClient from '../api/client';
import { LoginRequest, RegisterRequest, User, VerifyOtpRequest } from '../api/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  verifyOtp: (data: VerifyOtpRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await apiClient.getToken();
      console.log('AuthContext - Token exists:', !!token);
      if (token) {
        const userData = await authApi.getCurrentUser();
        console.log('AuthContext - User data from /me:', JSON.stringify(userData, null, 2));
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await apiClient.clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authApi.login(credentials);
      setUser(response.user);
    } catch (error: any) {
      // Pass through the complete error object so LoginScreen can access error.response
      console.log('AuthContext login error:', JSON.stringify(error?.response?.data, null, 2));
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      await authApi.register(data);
      // After registration, user might need to verify OTP
    } catch (error) {
      throw error;
    }
  };

  const verifyOtp = async (data: VerifyOtpRequest) => {
    try {
      const response = await authApi.verifyOtp(data);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    verifyOtp,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
