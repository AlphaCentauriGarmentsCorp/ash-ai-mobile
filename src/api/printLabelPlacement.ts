import apiClient from './client';
import { ApiResponse, PaginatedResponse } from './types';

// Print Label Placement interface
export interface PrintLabelPlacement {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Create Print Label Placement request interface
export interface CreatePrintLabelPlacementRequest {
  name: string;
  description?: string;
}

// Update Print Label Placement request interface
export interface UpdatePrintLabelPlacementRequest extends Partial<CreatePrintLabelPlacementRequest> {
}

export const printLabelPlacementApi = {
  // Get all print label placements with pagination
  index: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<PaginatedResponse<PrintLabelPlacement>> => {
    return await apiClient.get<PaginatedResponse<PrintLabelPlacement>>('/print-label-placement', {
      params,
    });
  },

  // Get all print label placements without pagination (for dropdowns)
  getAll: async (): Promise<ApiResponse<PrintLabelPlacement[]>> => {
    return await apiClient.get<ApiResponse<PrintLabelPlacement[]>>('/print-label-placement');
  },

  // Get a single print label placement by ID
  show: async (id: number): Promise<ApiResponse<PrintLabelPlacement>> => {
    return await apiClient.get<ApiResponse<PrintLabelPlacement>>(`/print-label-placement/${id}`);
  },

  // Create a new print label placement
  store: async (data: CreatePrintLabelPlacementRequest): Promise<ApiResponse<PrintLabelPlacement>> => {
    return await apiClient.post<ApiResponse<PrintLabelPlacement>>('/print-label-placement', data);
  },

  // Update a print label placement
  update: async (id: number, data: UpdatePrintLabelPlacementRequest): Promise<ApiResponse<PrintLabelPlacement>> => {
    return await apiClient.put<ApiResponse<PrintLabelPlacement>>(`/print-label-placement/${id}`, data);
  },

  // Delete a print label placement
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return await apiClient.delete<ApiResponse<void>>(`/print-label-placement/${id}`);
  },

  // Bulk delete print label placements
  bulkDelete: async (ids: number[]): Promise<ApiResponse<void>> => {
    return await apiClient.post<ApiResponse<void>>('/print-label-placement/bulk-delete', {
      ids,
    });
  },
};