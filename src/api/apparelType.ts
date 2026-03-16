import apiClient from './client';
import { ApiResponse, PaginatedResponse } from './types';

// Apparel Type interface
export interface ApparelType {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Create Apparel Type request interface
export interface CreateApparelTypeRequest {
  name: string;
  description?: string;
}

// Update Apparel Type request interface
export interface UpdateApparelTypeRequest extends Partial<CreateApparelTypeRequest> {
}

export const apparelTypeApi = {
  // Get all apparel types with pagination
  index: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<PaginatedResponse<ApparelType>> => {
    return await apiClient.get<PaginatedResponse<ApparelType>>('/apparel-type', {
      params,
    });
  },

  // Get all apparel types without pagination (for dropdowns)
  getAll: async (): Promise<ApiResponse<ApparelType[]>> => {
    return await apiClient.get<ApiResponse<ApparelType[]>>('/apparel-type');
  },

  // Get a single apparel type by ID
  show: async (id: number): Promise<ApiResponse<ApparelType>> => {
    return await apiClient.get<ApiResponse<ApparelType>>(`/apparel-type/${id}`);
  },

  // Create a new apparel type
  store: async (data: CreateApparelTypeRequest): Promise<ApiResponse<ApparelType>> => {
    return await apiClient.post<ApiResponse<ApparelType>>('/apparel-type', data);
  },

  // Update an apparel type
  update: async (id: number, data: UpdateApparelTypeRequest): Promise<ApiResponse<ApparelType>> => {
    return await apiClient.put<ApiResponse<ApparelType>>(`/apparel-type/${id}`, data);
  },

  // Delete an apparel type
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return await apiClient.delete<ApiResponse<void>>(`/apparel-type/${id}`);
  },

  // Bulk delete apparel types
  bulkDelete: async (ids: number[]): Promise<ApiResponse<void>> => {
    return await apiClient.post<ApiResponse<void>>('/apparel-type/bulk-delete', {
      ids,
    });
  },
};