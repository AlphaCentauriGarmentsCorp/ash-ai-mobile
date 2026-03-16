import apiClient from './client';
import API_CONFIG from './config';
import { ApiResponse, Client, CreateClientRequest, PaginatedResponse, UpdateClientRequest } from './types';

export const clientsApi = {
  // Get all clients with pagination
  index: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<PaginatedResponse<Client>> => {
    return await apiClient.get<PaginatedResponse<Client>>(API_CONFIG.ENDPOINTS.CLIENTS, {
      params,
    });
  },

  // Get all clients without pagination (for dropdowns)
  getAll: async (): Promise<ApiResponse<Client[]>> => {
    return await apiClient.get<ApiResponse<Client[]>>(API_CONFIG.ENDPOINTS.CLIENTS, {
      params: { all: true },
    });
  },

  // Get a single client by ID
  show: async (id: number): Promise<ApiResponse<Client>> => {
    return await apiClient.get<ApiResponse<Client>>(API_CONFIG.ENDPOINTS.CLIENT_BY_ID(id));
  },

  // Create a new client
  store: async (data: CreateClientRequest): Promise<ApiResponse<Client>> => {
    return await apiClient.post<ApiResponse<Client>>(API_CONFIG.ENDPOINTS.CLIENTS, data);
  },

  // Update a client
  update: async (id: number, data: UpdateClientRequest): Promise<ApiResponse<Client>> => {
    return await apiClient.put<ApiResponse<Client>>(API_CONFIG.ENDPOINTS.CLIENT_UPDATE(id), data);
  },

  // Delete a client
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return await apiClient.delete<ApiResponse<void>>(API_CONFIG.ENDPOINTS.CLIENT_DELETE(id));
  },
};
