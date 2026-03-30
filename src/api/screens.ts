import apiClient from './client';
import { ApiResponse, PaginatedResponse } from './types';

export interface Screen {
  id: number;
  name: string;
  address: string;
  size: string;
  mesh_count: number;
  last_maintenance?: string;
  last_used?: string;
  total_use?: number;
  status?: string;
  created_at?: string;
}

export interface CreateScreenRequest {
  name?: string;
  address: string;
  size: string;
  mesh_count: number;
}

const SCREENS = '/screens';

export const screenApi = {
  getAll: async (params?: { page?: number; per_page?: number; search?: string }): Promise<PaginatedResponse<Screen>> =>
    apiClient.get(SCREENS, { params }),

  store: async (data: CreateScreenRequest): Promise<ApiResponse<Screen>> =>
    apiClient.post(SCREENS, data),

  show: async (id: number): Promise<ApiResponse<Screen>> =>
    apiClient.get(`${SCREENS}/${id}`),

  update: async (id: number, data: Partial<CreateScreenRequest>): Promise<ApiResponse<Screen>> =>
    apiClient.put(`${SCREENS}/${id}`, data),

  delete: async (id: number): Promise<ApiResponse<void>> =>
    apiClient.delete(`${SCREENS}/${id}`),
};
