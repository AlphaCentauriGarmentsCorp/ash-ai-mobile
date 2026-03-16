import apiClient from './client';
import API_CONFIG from './config';
import { ApiResponse, CreateOrderRequest, Order, PaginatedResponse } from './types';

export const orderApi = {
  // Get all orders with pagination
  index: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
  }): Promise<PaginatedResponse<Order>> => {
    return await apiClient.get<PaginatedResponse<Order>>(API_CONFIG.ENDPOINTS.ORDERS, {
      params,
    });
  },

  // Create a new order
  store: async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    return await apiClient.post<ApiResponse<Order>>(API_CONFIG.ENDPOINTS.ORDERS, data);
  },

  // Get order details by PO code
  show: async (poCode: string): Promise<ApiResponse<Order>> => {
    return await apiClient.get<ApiResponse<Order>>(`${API_CONFIG.ENDPOINTS.ORDERS}/details/${poCode}`);
  },

  // Update an order (optional - not in the image but commonly needed)
  update: async (id: number, data: Partial<CreateOrderRequest>): Promise<ApiResponse<Order>> => {
    return await apiClient.put<ApiResponse<Order>>(API_CONFIG.ENDPOINTS.ORDER_BY_ID(id), data);
  },

  // Delete an order (optional - not in the image but commonly needed)
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return await apiClient.delete<ApiResponse<void>>(API_CONFIG.ENDPOINTS.ORDER_BY_ID(id));
  },
};
