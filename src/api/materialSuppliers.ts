import apiClient from './client';
import { ApiResponse, PaginatedResponse } from './types';

export interface Supplier {
  id: number;
  code_name: string;
  contact_person: string;
  contact_information: string;
  email: string;
  street: string;
  province: string;
  barangay: string;
  city: string;
  postal_code: string;
  notes?: string;
  status: string;
  created_at?: string;
}

export interface CreateSupplierRequest {
  code_name: string;
  contact_person: string;
  contact_information: string;
  email: string;
  street: string;
  province: string;
  barangay: string;
  city: string;
  postal_code: string;
  notes?: string;
}

export interface Material {
  id: number;
  material_type: string;
  name: string;
  supplier_name: string;
  finishing: string;
  unit_price: string;
  status: string;
  address?: string;
  created_at?: string;
}

const SUPPLIERS = '/suppliers';
const MATERIALS = '/materials';

export const supplierApi = {
  getAll: async (params?: { page?: number; per_page?: number; search?: string }): Promise<PaginatedResponse<Supplier>> =>
    apiClient.get(SUPPLIERS, { params }),

  store: async (data: CreateSupplierRequest): Promise<ApiResponse<Supplier>> =>
    apiClient.post(SUPPLIERS, data),

  show: async (id: number): Promise<ApiResponse<Supplier>> =>
    apiClient.get(`${SUPPLIERS}/${id}`),

  update: async (id: number, data: Partial<CreateSupplierRequest>): Promise<ApiResponse<Supplier>> =>
    apiClient.put(`${SUPPLIERS}/${id}`, data),

  delete: async (id: number): Promise<ApiResponse<void>> =>
    apiClient.delete(`${SUPPLIERS}/${id}`),
};

export const materialApi = {
  getAll: async (params?: { page?: number; per_page?: number; search?: string }): Promise<PaginatedResponse<Material>> =>
    apiClient.get(MATERIALS, { params }),
};
