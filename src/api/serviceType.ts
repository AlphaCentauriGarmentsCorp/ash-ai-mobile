import apiClient from './client';
import { ApiResponse, PaginatedResponse } from './types';

// Service Type interface
export interface ServiceType {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Create Service Type request interface
export interface CreateServiceTypeRequest {
  name: string;
  description?: string;
}

// Update Service Type request interface
export interface UpdateServiceTypeRequest extends Partial<CreateServiceTypeRequest> {
}

export const serviceTypeApi = {
  // Get all service types with pagination
  index: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<PaginatedResponse<ServiceType>> => {
    return await apiClient.get<PaginatedResponse<ServiceType>>('/service-type', {
      params,
    });
  },

  // Get all service types without pagination (for dropdowns)
  getAll: async (): Promise<ApiResponse<ServiceType[]>> => {
    return await apiClient.get<ApiResponse<ServiceType[]>>('/service-type');
  },

  // Get a single service type by ID
  show: async (id: number): Promise<ApiResponse<ServiceType>> => {
    return await apiClient.get<ApiResponse<ServiceType>>(`/service-type/${id}`);
  },

  // Create a new service type
  store: async (data: CreateServiceTypeRequest): Promise<ApiResponse<ServiceType>> => {
    return await apiClient.post<ApiResponse<ServiceType>>('/service-type', data);
  },

  // Update a service type
  update: async (id: number, data: UpdateServiceTypeRequest): Promise<ApiResponse<ServiceType>> => {
    return await apiClient.put<ApiResponse<ServiceType>>(`/service-type/${id}`, data);
  },

  // Delete a service type
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return await apiClient.delete<ApiResponse<void>>(`/service-type/${id}`);
  },

  // Bulk delete service types
  bulkDelete: async (ids: number[]): Promise<ApiResponse<void>> => {
    return await apiClient.post<ApiResponse<void>>('/service-type/bulk-delete', {
      ids,
    });
  },
};