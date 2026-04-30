import apiClient from './client';
import API_CONFIG from './config';
import { ApiResponse, PaginatedResponse } from './types';

export interface Quotation {
  id: number;
  quotation_no: string;
  created_by?: string;
  client_name: string;
  client_email: string;
  brand?: string;
  total_amount?: number;
  status?: string;
  created_at?: string;
}

export interface CreateQuotationRequest {
  client_name: string;
  client_email: string;
  brand?: string;
  shirt_color?: string;
  free_items?: string;
  tshirt_type_id?: number | null;
  neckline_id?: number | null;
  print_type_id?: number | null;
  print_color_count?: number | null;
  print_pattern_id?: number | null;
}

export const quotationApi = {
  index: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
  }): Promise<PaginatedResponse<Quotation>> => {
    return await apiClient.get<PaginatedResponse<Quotation>>(
      API_CONFIG.ENDPOINTS.QUOTATIONS,
      { params }
    );
  },

  store: async (data: CreateQuotationRequest): Promise<ApiResponse<Quotation>> => {
    return await apiClient.post<ApiResponse<Quotation>>(
      API_CONFIG.ENDPOINTS.QUOTATIONS,
      data
    );
  },

  show: async (id: number): Promise<ApiResponse<Quotation>> => {
    return await apiClient.get<ApiResponse<Quotation>>(
      API_CONFIG.ENDPOINTS.QUOTATION_BY_ID(id)
    );
  },
};

export default quotationApi;