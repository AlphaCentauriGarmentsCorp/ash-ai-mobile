import apiClient from './client';
import { ApiResponse, PaginatedResponse } from './types';

// Placement Measurement interface
export interface PlacementMeasurement {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Create Placement Measurement request interface
export interface CreatePlacementMeasurementRequest {
  name: string;
  description?: string;
}

// Update Placement Measurement request interface
export interface UpdatePlacementMeasurementRequest extends Partial<CreatePlacementMeasurementRequest> {
}

export const placementMeasurementApi = {
  // Get all placement measurements with pagination
  index: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<PaginatedResponse<PlacementMeasurement>> => {
    return await apiClient.get<PaginatedResponse<PlacementMeasurement>>('/placement-measurement', {
      params,
    });
  },

  // Get all placement measurements without pagination (for dropdowns)
  getAll: async (): Promise<ApiResponse<PlacementMeasurement[]>> => {
    return await apiClient.get<ApiResponse<PlacementMeasurement[]>>('/placement-measurement');
  },

  // Get a single placement measurement by ID
  show: async (id: number): Promise<ApiResponse<PlacementMeasurement>> => {
    return await apiClient.get<ApiResponse<PlacementMeasurement>>(`/placement-measurement/${id}`);
  },

  // Create a new placement measurement
  store: async (data: CreatePlacementMeasurementRequest): Promise<ApiResponse<PlacementMeasurement>> => {
    return await apiClient.post<ApiResponse<PlacementMeasurement>>('/placement-measurement', data);
  },

  // Update a placement measurement
  update: async (id: number, data: UpdatePlacementMeasurementRequest): Promise<ApiResponse<PlacementMeasurement>> => {
    return await apiClient.put<ApiResponse<PlacementMeasurement>>(`/placement-measurement/${id}`, data);
  },

  // Delete a placement measurement
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return await apiClient.delete<ApiResponse<void>>(`/placement-measurement/${id}`);
  },

  // Bulk delete placement measurements
  bulkDelete: async (ids: number[]): Promise<ApiResponse<void>> => {
    return await apiClient.post<ApiResponse<void>>('/placement-measurement/bulk-delete', {
      ids,
    });
  },
};