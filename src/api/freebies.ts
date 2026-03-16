import apiClient from './client';
import { ApiResponse, PaginatedResponse } from './types';

// Freebie interface
export interface Freebie {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Create Freebie request interface
export interface CreateFreebieRequest {
  name: string;
  description?: string;
}

// Update Freebie request interface
export interface UpdateFreebieRequest extends Partial<CreateFreebieRequest> {
}

export const freebiesApi = {
  // Get all freebies with pagination
  index: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<PaginatedResponse<Freebie>> => {
    return await apiClient.get<PaginatedResponse<Freebie>>('/freebie', {
      params,
    });
  },

  // Get all freebies without pagination (for dropdowns)
  getAll: async (): Promise<ApiResponse<Freebie[]>> => {
    return await apiClient.get<ApiResponse<Freebie[]>>('/freebie');
  },

  // Get a single freebie by ID
  show: async (id: number): Promise<ApiResponse<Freebie>> => {
    return await apiClient.get<ApiResponse<Freebie>>(`/freebie/${id}`);
  },

  // Create a new freebie
  store: async (data: CreateFreebieRequest): Promise<ApiResponse<Freebie>> => {
    return await apiClient.post<ApiResponse<Freebie>>('/freebie', data);
  },

  // Update a freebie
  update: async (id: number, data: UpdateFreebieRequest): Promise<ApiResponse<Freebie>> => {
    return await apiClient.put<ApiResponse<Freebie>>(`/freebie/${id}`, data);
  },

  // Delete a freebie
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return await apiClient.delete<ApiResponse<void>>(`/freebie/${id}`);
  },

  // Bulk delete freebies
  bulkDelete: async (ids: number[]): Promise<ApiResponse<void>> => {
    return await apiClient.post<ApiResponse<void>>('/freebie/bulk-delete', {
      ids,
    });
  },
};