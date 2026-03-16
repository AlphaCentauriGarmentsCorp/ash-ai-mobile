import { ApiResponse, PaginatedResponse } from './types';

// Generic Dropdown Setting interface
export interface DropdownSetting {
  id: number;
  name: string;
  description?: string;
  type: string;
  created_at: string;
  updated_at: string;
}

// Create Dropdown Setting request interface
export interface CreateDropdownSettingRequest {
  name: string;
  description?: string;
  type: string;
}

// Update Dropdown Setting request interface
export interface UpdateDropdownSettingRequest extends Partial<CreateDropdownSettingRequest> {
}

// Dropdown setting types
export type DropdownSettingType = 
  | 'pattern-type'
  | 'apparel-type' 
  | 'service-type'
  | 'fabric-type'
  | 'color'
  | 'size'
  | 'print-label'
  | 'print-method'
  | 'additional-options';

export const dropdownSettingsApi = {
  // Get all dropdown settings with pagination and filtering by type
  index: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    type?: string;
  }): Promise<PaginatedResponse<DropdownSetting>> => {
    console.warn('Generic dropdown-settings endpoint not implemented - using individual endpoints instead');
    return {
      data: [],
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 0,
      to: 0
    };
  },

  // Get all dropdown settings without pagination (for dropdowns)
  getAll: async (type?: string): Promise<ApiResponse<DropdownSetting[]>> => {
    console.warn('Generic dropdown-settings endpoint not implemented - using individual endpoints instead');
    return { success: true, data: [], message: 'Not implemented' };
  },

  // Get dropdown settings by type
  getByType: async (type: DropdownSettingType): Promise<ApiResponse<DropdownSetting[]>> => {
    console.warn('Generic dropdown-settings endpoint not implemented - using individual endpoints instead');
    return { success: true, data: [], message: 'Not implemented' };
  },

  // Get a single dropdown setting by ID
  show: async (id: number): Promise<ApiResponse<DropdownSetting>> => {
    console.warn('Generic dropdown-settings endpoint not implemented - using individual endpoints instead');
    return { success: false, data: {} as DropdownSetting, message: 'Not implemented' };
  },

  // Create a new dropdown setting
  store: async (data: CreateDropdownSettingRequest): Promise<ApiResponse<DropdownSetting>> => {
    console.warn('Generic dropdown-settings endpoint not implemented - using individual endpoints instead');
    return { success: false, data: {} as DropdownSetting, message: 'Not implemented' };
  },

  // Update a dropdown setting
  update: async (id: number, data: UpdateDropdownSettingRequest): Promise<ApiResponse<DropdownSetting>> => {
    console.warn('Generic dropdown-settings endpoint not implemented - using individual endpoints instead');
    return { success: false, data: {} as DropdownSetting, message: 'Not implemented' };
  },

  // Delete a dropdown setting
  delete: async (id: number): Promise<ApiResponse<void>> => {
    console.warn('Generic dropdown-settings endpoint not implemented - using individual endpoints instead');
    return { success: false, data: undefined, message: 'Not implemented' };
  },

  // Bulk delete dropdown settings
  bulkDelete: async (ids: number[]): Promise<ApiResponse<void>> => {
    console.warn('Generic dropdown-settings endpoint not implemented - using individual endpoints instead');
    return { success: false, data: undefined, message: 'Not implemented' };
  },
};