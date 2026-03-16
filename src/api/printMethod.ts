import apiClient from './client';
import { ApiResponse, PaginatedResponse } from './types';

// Print Method interface
export interface PrintMethod {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Create Print Method request interface
export interface CreatePrintMethodRequest {
  name: string;
  description?: string;
}

// Update Print Method request interface
export interface UpdatePrintMethodRequest extends Partial<CreatePrintMethodRequest> {
}

export const printMethodApi = {
  // Get all print methods with pagination
  index: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<PaginatedResponse<PrintMethod>> => {
    return await apiClient.get<PaginatedResponse<PrintMethod>>('/print-method', {
      params,
    });
  },

  // Get all print methods without pagination (for dropdowns)
  getAll: async (): Promise<ApiResponse<PrintMethod[]>> => {
    return await apiClient.get<ApiResponse<PrintMethod[]>>('/print-method');
  },

  // Get a single print method by ID
  show: async (id: number): Promise<ApiResponse<PrintMethod>> => {
    return await apiClient.get<ApiResponse<PrintMethod>>(`/print-method/${id}`);
  },

  // Create a new print method
  store: async (data: CreatePrintMethodRequest): Promise<ApiResponse<PrintMethod>> => {
    return await apiClient.post<ApiResponse<PrintMethod>>('/print-method', data);
  },

  // Update a print method
  update: async (id: number, data: UpdatePrintMethodRequest): Promise<ApiResponse<PrintMethod>> => {
    return await apiClient.put<ApiResponse<PrintMethod>>(`/print-method/${id}`, data);
  },

  // Delete a print method
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return await apiClient.delete<ApiResponse<void>>(`/print-method/${id}`);
  },

  // Bulk delete print methods
  bulkDelete: async (ids: number[]): Promise<ApiResponse<void>> => {
    return await apiClient.post<ApiResponse<void>>('/print-method/bulk-delete', {
      ids,
    });
  },
};