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
  shirt_color?: string;
  free_items?: string;
  tshirt_type_id?: number;
  neckline_id?: number;
  print_type_id?: number;
  print_color_count?: number;
  print_pattern_id?: number;
  tshirt_type?: string;
  neckline?: string;
  print_type?: string;
  print_pattern?: string;
  total_amount?: number;
  status?: string;
  created_at?: string;
  items?: any[];
  // ── newly added ──
  notes?: string;
  discount_type?: string;
  discount_value?: number | string;
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

  item_config_json?: string;
  items_json?: string;

  // ── newly added ──
  notes?: string;
  discount_type?: string;
  discount_value?: number | string;
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

  show: async (id: number | string): Promise<ApiResponse<Quotation>> => {
    return await apiClient.get<ApiResponse<Quotation>>(
      API_CONFIG.ENDPOINTS.QUOTATION_BY_ID(Number(id))
    );
  },

  update: async (
    id: number | string,
    data: CreateQuotationRequest
  ): Promise<ApiResponse<Quotation>> => {
    return await apiClient.put<ApiResponse<Quotation>>(
      API_CONFIG.ENDPOINTS.QUOTATION_BY_ID(Number(id)),
      data
    );
  },

  destroy: async (id: number | string): Promise<ApiResponse<void>> => {
    return await apiClient.delete<ApiResponse<void>>(
      API_CONFIG.ENDPOINTS.QUOTATION_BY_ID(Number(id))
    );
  },
};

export default quotationApi;