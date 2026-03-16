import apiClient from './client';
import { ApiResponse, PaginatedResponse } from './types';

// Pattern Type interface
export interface PatternType {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Create Pattern Type request interface
export interface CreatePatternTypeRequest {
  name: string;
  description?: string;
}

// Update Pattern Type request interface
export interface UpdatePatternTypeRequest extends Partial<CreatePatternTypeRequest> {
}

export const patternTypeApi = {
  // Get all pattern types with pagination
  index: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<PaginatedResponse<PatternType>> => {
    return await apiClient.get<PaginatedResponse<PatternType>>('/pattern-type', {
      params,
    });
  },

  // Get all pattern types without pagination (for dropdowns)
  getAll: async (): Promise<ApiResponse<PatternType[]>> => {
    return await apiClient.get<ApiResponse<PatternType[]>>('/pattern-type');
  },

  // Get a single pattern type by ID
  show: async (id: number): Promise<ApiResponse<PatternType>> => {
    return await apiClient.get<ApiResponse<PatternType>>(`/pattern-type/${id}`);
  },

  // Create a new pattern type
  store: async (data: CreatePatternTypeRequest): Promise<ApiResponse<PatternType>> => {
    return await apiClient.post<ApiResponse<PatternType>>('/pattern-type', data);
  },

  // Update a pattern type
  update: async (id: number, data: UpdatePatternTypeRequest): Promise<ApiResponse<PatternType>> => {
    return await apiClient.put<ApiResponse<PatternType>>(`/pattern-type/${id}`, data);
  },

  // Delete a pattern type
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return await apiClient.delete<ApiResponse<void>>(`/pattern-type/${id}`);
  },

  // Bulk delete pattern types
  bulkDelete: async (ids: number[]): Promise<ApiResponse<void>> => {
    return await apiClient.post<ApiResponse<void>>('/pattern-type/bulk-delete', {
      ids,
    });
  },
};