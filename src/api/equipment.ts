import apiClient from './client';
import { ApiResponse, PaginatedResponse } from './types';

export interface EquipmentLocation {
  id: number;
  name: string;
  icon?: string;
  description?: string;
  created_at?: string;
}

export interface Equipment {
  id: number;
  location_id: number;
  name: string;
  quantity: number;
  color?: string;
  model?: string;
  material?: string;
  price?: string;
  penalty?: string;
  design?: string;
  description?: string;
  image?: string;
  qr_code?: string;
  receipt?: string[];
  in_use?: number;
  available?: number;
  missing?: number;
  status?: string;
  location?: EquipmentLocation;
  created_at?: string;
}

export interface CreateEquipmentRequest {
  location_id: number;
  name: string;
  quantity: number;
  color?: string;
  model?: string;
  material?: string;
  price?: string;
  penalty?: string;
  design?: string;
  description?: string;
  image?: any;
  receipt?: any[];
}

const EQUIPMENT = '/equipment-inventory';
const LOCATIONS = '/equipment-location';

export const equipmentApi = {
  getAll: async (params?: { page?: number; per_page?: number; search?: string }): Promise<PaginatedResponse<Equipment>> =>
    apiClient.get(EQUIPMENT, { params }),

  getByLocation: async (locationId: number): Promise<ApiResponse<Equipment[]>> =>
    apiClient.get(`${EQUIPMENT}/${locationId}/contents`),

  store: async (data: CreateEquipmentRequest): Promise<ApiResponse<Equipment>> => {
    const formData = new FormData();
    
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof CreateEquipmentRequest];
      
      if (key === 'receipt' && Array.isArray(value)) {
        value.forEach((file: any) => {
          formData.append('receipt[]', file);
        });
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });

    return apiClient.uploadFile(EQUIPMENT, formData, 'POST');
  },

  show: async (id: number): Promise<ApiResponse<Equipment>> =>
    apiClient.get(`${EQUIPMENT}/${id}`),

  update: async (id: number, data: Partial<CreateEquipmentRequest>): Promise<ApiResponse<Equipment>> => {
    const formData = new FormData();
    
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof CreateEquipmentRequest];
      
      if (key === 'receipt' && Array.isArray(value)) {
        value.forEach((file: any) => {
          formData.append('receipt[]', file);
        });
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });

    formData.append('_method', 'PUT');
    return apiClient.uploadFile(`${EQUIPMENT}/${id}`, formData, 'POST');
  },

  delete: async (id: number): Promise<ApiResponse<void>> =>
    apiClient.delete(`${EQUIPMENT}/${id}`),
};

export const equipmentLocationApi = {
  getAll: async (): Promise<ApiResponse<EquipmentLocation[]>> =>
    apiClient.get(LOCATIONS),

  store: async (data: { name: string; icon: string; description?: string }): Promise<ApiResponse<EquipmentLocation>> =>
    apiClient.post(LOCATIONS, data),

  show: async (id: number): Promise<ApiResponse<EquipmentLocation>> =>
    apiClient.get(`${LOCATIONS}/${id}`),

  update: async (id: number, data: { name?: string; icon?: string; description?: string }): Promise<ApiResponse<EquipmentLocation>> =>
    apiClient.put(`${LOCATIONS}/${id}`, data),

  delete: async (id: number): Promise<ApiResponse<void>> =>
    apiClient.delete(`${LOCATIONS}/${id}`),
};
