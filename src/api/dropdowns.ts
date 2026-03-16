import { additionalOptionsApi } from './additionalOptions';
import { apparelTypeApi } from './apparelType';
import { freebiesApi } from './freebies';
import { patternTypeApi } from './patternType';
import { placementMeasurementApi } from './placementMeasurement';
import { printLabelPlacementApi } from './printLabelPlacement';
import { printMethodApi } from './printMethod';
import { serviceTypeApi } from './serviceType';
import { sizeLabelApi } from './sizeLabel';
import { ApiResponse } from './types';

// Dropdown option interface
export interface DropdownOption {
  id: string | number;
  name: string;
  description?: string;
  type?: string;
  created_at?: string;
  updated_at?: string;
}

export const dropdownsApi = {
  // Get additional options from the additional options API
  getAdditionalOptions: async (): Promise<ApiResponse<DropdownOption[]>> => {
    try {
      const response = await additionalOptionsApi.getAll();
      // Convert the response to match the expected format
      return {
        success: true,
        data: response.data || response,
        message: response.message || 'Additional options loaded successfully'
      };
    } catch (error: any) {
      console.error('Error fetching additional options:', error);
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to load additional options'
      };
    }
  },

  // For now, let's create placeholder functions that return empty arrays
  // until the backend endpoints are created
  // Get apparel types from the apparel type API
  getApparelTypes: async (): Promise<ApiResponse<DropdownOption[]>> => {
    try {
      const response = await apparelTypeApi.getAll();
      // Convert the response to match the expected format
      return {
        success: true,
        data: response.data || response,
        message: response.message || 'Apparel types loaded successfully'
      };
    } catch (error: any) {
      console.error('Error fetching apparel types:', error);
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to load apparel types'
      };
    }
  },

  getPatternTypes: async (): Promise<ApiResponse<DropdownOption[]>> => {
    try {
      const response = await patternTypeApi.getAll();
      // Convert the response to match the expected format
      return {
        success: true,
        data: response.data || response,
        message: response.message || 'Pattern types loaded successfully'
      };
    } catch (error: any) {
      console.error('Error fetching pattern types:', error);
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to load pattern types'
      };
    }
  },

  getServiceTypes: async (): Promise<ApiResponse<DropdownOption[]>> => {
    try {
      const response = await serviceTypeApi.getAll();
      // Convert the response to match the expected format
      return {
        success: true,
        data: response.data || response,
        message: response.message || 'Service types loaded successfully'
      };
    } catch (error: any) {
      console.error('Error fetching service types:', error);
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to load service types'
      };
    }
  },

  getPrintMethods: async (): Promise<ApiResponse<DropdownOption[]>> => {
    try {
      const response = await printMethodApi.getAll();
      // Convert the response to match the expected format
      return {
        success: true,
        data: response.data || response,
        message: response.message || 'Print methods loaded successfully'
      };
    } catch (error: any) {
      console.error('Error fetching print methods:', error);
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to load print methods'
      };
    }
  },

  getSizeLabels: async (): Promise<ApiResponse<DropdownOption[]>> => {
    try {
      const response = await sizeLabelApi.getAll();
      // Convert the response to match the expected format
      return {
        success: true,
        data: response.data || response,
        message: response.message || 'Size labels loaded successfully'
      };
    } catch (error: any) {
      console.error('Error fetching size labels:', error);
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to load size labels'
      };
    }
  },

  getPrintLabelPlacements: async (): Promise<ApiResponse<DropdownOption[]>> => {
    try {
      const response = await printLabelPlacementApi.getAll();
      // Convert the response to match the expected format
      return {
        success: true,
        data: response.data || response,
        message: response.message || 'Print label placements loaded successfully'
      };
    } catch (error: any) {
      console.error('Error fetching print label placements:', error);
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to load print label placements'
      };
    }
  },

  getMaterials: async (): Promise<ApiResponse<DropdownOption[]>> => {
    console.warn('Materials endpoint not implemented yet');
    return { success: true, data: [], message: 'Not implemented' };
  },

  getFreebies: async (): Promise<ApiResponse<DropdownOption[]>> => {
    try {
      const response = await freebiesApi.getAll();
      // Convert the response to match the expected format
      return {
        success: true,
        data: response.data || response,
        message: response.message || 'Freebies loaded successfully'
      };
    } catch (error: any) {
      console.error('Error fetching freebies:', error);
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to load freebies'
      };
    }
  },

  getPlacementMeasurements: async (): Promise<ApiResponse<DropdownOption[]>> => {
    try {
      const response = await placementMeasurementApi.getAll();
      // Convert the response to match the expected format
      return {
        success: true,
        data: response.data || response,
        message: response.message || 'Placement measurements loaded successfully'
      };
    } catch (error: any) {
      console.error('Error fetching placement measurements:', error);
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to load placement measurements'
      };
    }
  },

  // Generic function to get dropdown settings by type (for future use)
  getDropdownSettingsByType: async (type: string): Promise<ApiResponse<DropdownOption[]>> => {
    console.warn(`Dropdown settings endpoint for type '${type}' not implemented yet`);
    return { success: true, data: [], message: 'Not implemented' };
  },

  getMaterialsByType: async (type: string): Promise<ApiResponse<DropdownOption[]>> => {
    console.warn('Materials by type endpoint not implemented yet');
    return { success: true, data: [], message: 'Not implemented' };
  },
};