import apiClient from './client';
import API_CONFIG from './config';
import { ApiResponse, PaginatedResponse } from './types';

// Additional Option interface
export interface AdditionalOption {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Create Additional Option request interface
export interface CreateAdditionalOptionRequest {
  name: string;
  description?: string;
}

// Update Additional Option request interface
export interface UpdateAdditionalOptionRequest extends Partial<CreateAdditionalOptionRequest> {
}

export const additionalOptionsApi = {
  // Get all additional options with pagination
  index: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<PaginatedResponse<AdditionalOption>> => {
    return await apiClient.get<PaginatedResponse<AdditionalOption>>(API_CONFIG.ENDPOINTS.ADDITIONAL_OPTIONS, {
      params,
    });
  },

  // Get all additional options without pagination (for dropdowns)
  getAll: async (): Promise<ApiResponse<AdditionalOption[]>> => {
    return await apiClient.get<ApiResponse<AdditionalOption[]>>(API_CONFIG.ENDPOINTS.ADDITIONAL_OPTIONS, {
      params: { all: true },
    });
  },

  // Get a single additional option by ID
  show: async (id: number): Promise<ApiResponse<AdditionalOption>> => {
    const url = API_CONFIG.ENDPOINTS.ADDITIONAL_OPTION_BY_ID(id);
    return await apiClient.get<ApiResponse<AdditionalOption>>(url);
  },

  // Create a new additional option
  store: async (data: CreateAdditionalOptionRequest): Promise<ApiResponse<AdditionalOption>> => {
    return await apiClient.post<ApiResponse<AdditionalOption>>(API_CONFIG.ENDPOINTS.ADDITIONAL_OPTIONS, data);
  },

  // Update an additional option
  update: async (id: number, data: UpdateAdditionalOptionRequest): Promise<ApiResponse<AdditionalOption>> => {
    return await apiClient.put<ApiResponse<AdditionalOption>>(API_CONFIG.ENDPOINTS.ADDITIONAL_OPTION_BY_ID(id), data);
  },

  // Delete an additional option
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return await apiClient.delete<ApiResponse<void>>(API_CONFIG.ENDPOINTS.ADDITIONAL_OPTION_BY_ID(id));
  },

  // Bulk delete additional options
  bulkDelete: async (ids: number[]): Promise<ApiResponse<void>> => {
    return await apiClient.post<ApiResponse<void>>(`${API_CONFIG.ENDPOINTS.ADDITIONAL_OPTIONS}/bulk-delete`, {
      ids,
    });
  },
};