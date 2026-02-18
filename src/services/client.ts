import apiClient from '../api/client';
import API_CONFIG from '../api/config';
import type { Client, CreateClientRequest, PaginatedResponse, UpdateClientRequest } from '../api/types';

class ClientService {
  // Get all clients with pagination
  async getClients(page = 1, perPage = 15, search?: string): Promise<PaginatedResponse<Client>> {
    const params: Record<string, any> = {
      page,
      per_page: perPage,
    };

    if (search) {
      params.search = search;
    }

    console.log('ClientService.getClients params:', params);
    return await apiClient.get<PaginatedResponse<Client>>(API_CONFIG.ENDPOINTS.CLIENTS, { params });
  }

  // Get single client by ID
  async getClientById(id: string): Promise<Client> {
    return await apiClient.get<Client>(API_CONFIG.ENDPOINTS.CLIENT_BY_ID(Number(id)));
  }

  // Create new client
  async createClient(data: CreateClientRequest): Promise<Client> {
    // Check if any brand has a logo (file upload required)
    const hasFiles = data.brands.some(brand => brand.logo);

    if (hasFiles) {
      // Use FormData for file uploads
      const formData = new FormData();
      
      // Add basic fields
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('email', data.email);
      formData.append('contact_number', data.contact_number);
      
      // Add optional address fields (always send them, even if empty)
      formData.append('street_address', data.street_address || '');
      formData.append('city', data.city || '');
      formData.append('province', data.province || '');
      formData.append('barangay', data.barangay || '');
      formData.append('postal_code', data.postal_code || '');
      formData.append('courier', data.courier || '');
      formData.append('method', data.method || '');
      formData.append('notes', data.notes || '');
      
      // Add brands
      data.brands.forEach((brand, index) => {
        formData.append(`brands[${index}][name]`, brand.name);
        if (brand.logo) {
          // React Native FormData requires specific format
          const file: any = {
            uri: brand.logo.uri,
            type: brand.logo.type || 'image/jpeg',
            name: brand.logo.name || `brand_logo_${index}.jpg`,
          };
          console.log(`Appending file for brand ${index}:`, file);
          formData.append(`brands[${index}][logo]`, file as any);
        }
      });

      console.log('Uploading with FormData - parts count:', (formData as any)._parts?.length);
      return await apiClient.uploadFile<Client>(API_CONFIG.ENDPOINTS.CLIENTS, formData);
    } else {
      // Use JSON for requests without files
      console.log('Submitting without files (JSON)');
      return await apiClient.post<Client>(API_CONFIG.ENDPOINTS.CLIENTS, data);
    }
  }

  // Update client
  async updateClient(id: string, data: UpdateClientRequest): Promise<Client> {
    // Check if any brand has a logo (file upload required)
    const hasFiles = data.brands?.some(brand => brand.logo && typeof brand.logo === 'object' && brand.logo.uri);

    if (hasFiles) {
      // Use FormData for file uploads
      const formData = new FormData();
      
      // Laravel workaround: Use POST with _method=PUT for file uploads
      formData.append('_method', 'PUT');
      
      // Add basic fields (only if they exist)
      if (data.first_name) formData.append('first_name', data.first_name);
      if (data.last_name) formData.append('last_name', data.last_name);
      if (data.email) formData.append('email', data.email);
      if (data.contact_number) formData.append('contact_number', data.contact_number);
      
      // Add optional address fields (only if they have values)
      if (data.street_address) formData.append('street_address', data.street_address);
      if (data.city) formData.append('city', data.city);
      if (data.province) formData.append('province', data.province);
      if (data.barangay) formData.append('barangay', data.barangay);
      if (data.postal_code) formData.append('postal_code', data.postal_code);
      if (data.courier) formData.append('courier', data.courier);
      if (data.method) formData.append('method', data.method);
      if (data.notes) formData.append('notes', data.notes);
      
      // Add brands if provided
      if (data.brands) {
        data.brands.forEach((brand, index) => {
          formData.append(`brands[${index}][name]`, brand.name);
          if (brand.logo && typeof brand.logo === 'object' && brand.logo.uri) {
            // React Native FormData requires specific format
            const file: any = {
              uri: brand.logo.uri,
              type: brand.logo.type || 'image/jpeg',
              name: brand.logo.name || `brand_logo_${index}.jpg`,
            };
            console.log(`Appending file for brand ${index}:`, file);
            formData.append(`brands[${index}][logo]`, file as any);
          }
        });
      }

      console.log('Updating with FormData (POST with _method=PUT) - parts count:', (formData as any)._parts?.length);
      // Use POST instead of PUT for FormData uploads (Laravel limitation)
      return await apiClient.uploadFile<Client>(API_CONFIG.ENDPOINTS.CLIENT_BY_ID(Number(id)), formData, 'POST');
    } else {
      // Use JSON for requests without files
      console.log('Updating without files (JSON with PUT)');
      return await apiClient.put<Client>(API_CONFIG.ENDPOINTS.CLIENT_BY_ID(Number(id)), data);
    }
  }

  // Delete client
  async deleteClient(id: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.CLIENT_BY_ID(Number(id)));
  }
}

export const clientService = new ClientService();
export default clientService;
