import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import API_CONFIG from './config';

// Storage keys
const TOKEN_KEY = '@auth_token';

class ApiClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      async (config) => {
        const token = await this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        const url = `${config.baseURL || ''}${config.url || ''}`;
        const params = config.params ? `?${new URLSearchParams(config.params).toString()}` : '';
        console.log('API Request:', config.method?.toUpperCase(), url + params);
        console.log('API Request headers:', config.headers);
        console.log('API Request data type:', config.data?.constructor?.name);
        if (config.data instanceof FormData) {
          console.log('FormData parts:', (config.data as any)._parts);
        }
        return config;
      },
      (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
      },
      async (error: AxiosError) => {
        // Log error details
        if (error.response) {
          console.error('API Error Response:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('API Network Error:', error.message);
        } else {
          console.error('API Error:', error.message);
        }

        // Handle 401 Unauthorized - clear token and redirect to login
        if (error.response?.status === 401) {
          await this.clearTokens();
        }

        return Promise.reject(error);
      }
    );
  }

  // Token management
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEY);
  }

  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }

  async setRefreshToken(token: string): Promise<void> {
    // Kept for compatibility but not used with Sanctum
    // Sanctum doesn't use refresh tokens
  }

  async clearTokens(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.patch(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url, config);
    return response.data;
  }

  // File upload with FormData
  async uploadFile<T = any>(url: string, formData: FormData, method: 'POST' | 'PUT' = 'POST', onUploadProgress?: (progressEvent: any) => void): Promise<T> {
    // For React Native FormData, we need to remove the default Content-Type
    // and let axios set it automatically with the correct boundary
    const response: AxiosResponse<T> = await this.api.request({
      method,
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
