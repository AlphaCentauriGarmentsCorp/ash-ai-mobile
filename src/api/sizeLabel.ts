import apiClient from './client';
import { ApiResponse, PaginatedResponse } from './types';

// Size Label interface
export interface SizeLabel {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Create Size Label request interface
export interface CreateSizeLabelRequest {
  name: string;
  description?: string;
}

// Update Size Label request interface
export interface UpdateSizeLabelRequest extends Partial<CreateSizeLabelRequest> {
}

export const sizeLabelApi = {
  // Get all size labels with pagination
  index: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<PaginatedResponse<SizeLabel>> => {
    return await apiClient.get<PaginatedResponse<SizeLabel>>('/size-label', {
      params,
    });
  },

  // Get all size labels without pagination (for dropdowns)
  getAll: async (): Promise<ApiResponse<SizeLabel[]>> => {
    return await apiClient.get<ApiResponse<SizeLabel[]>>('/size-label');
  },

  // Get a single size label by ID
  show: async (id: number): Promise<ApiResponse<SizeLabel>> => {
    return await apiClient.get<ApiResponse<SizeLabel>>(`/size-label/${id}`);
  },

  // Create a new size label
  store: async (data: CreateSizeLabelRequest): Promise<ApiResponse<SizeLabel>> => {
    return await apiClient.post<ApiResponse<SizeLabel>>('/size-label', data);
  },

  // Update a size label
  update: async (id: number, data: UpdateSizeLabelRequest): Promise<ApiResponse<SizeLabel>> => {
    return await apiClient.put<ApiResponse<SizeLabel>>(`/size-label/${id}`, data);
  },

  // Delete a size label
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return await apiClient.delete<ApiResponse<void>>(`/size-label/${id}`);
  },

  // Bulk delete size labels
  bulkDelete: async (ids: number[]): Promise<ApiResponse<void>> => {
    return await apiClient.post<ApiResponse<void>>('/size-label/bulk-delete', {
      ids,
    });
  },
};