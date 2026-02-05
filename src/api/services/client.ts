import apiClient from '../client';
import API_CONFIG from '../config';
import {
    ApiResponse,
    Client,
    CreateClientRequest,
    PaginatedResponse,
    UpdateClientRequest,
} from '../types';

class ClientService {
  async getClients(page = 1, perPage = 10, search?: string): Promise<PaginatedResponse<Client>> {
    const params: any = { page, per_page: perPage };
    if (search) params.search = search;

    return await apiClient.get<PaginatedResponse<Client>>(
      API_CONFIG.ENDPOINTS.CLIENTS,
      { params }
    );
  }

  async getClientById(id: string): Promise<Client> {
    const response = await apiClient.get<ApiResponse<Client>>(
      API_CONFIG.ENDPOINTS.CLIENT_BY_ID(id)
    );
    return response.data;
  }

  async createClient(data: CreateClientRequest): Promise<Client> {
    const formData = this.buildFormData(data);
    
    const response = await apiClient.uploadFile<ApiResponse<Client>>(
      API_CONFIG.ENDPOINTS.CLIENTS,
      formData
    );
    return response.data;
  }

  async updateClient(id: string, data: UpdateClientRequest): Promise<Client> {
    const formData = this.buildFormData(data);
    // Laravel requires _method for file uploads with PUT
    formData.append('_method', 'PUT');
    
    const response = await apiClient.uploadFile<ApiResponse<Client>>(
      API_CONFIG.ENDPOINTS.CLIENT_BY_ID(id),
      formData
    );
    return response.data;
  }

  async deleteClient(id: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.CLIENT_BY_ID(id));
  }

  private buildFormData(data: CreateClientRequest | UpdateClientRequest): FormData {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'logo' && value) {
          // Handle file upload
          formData.append(key, value as any);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    return formData;
  }
}

export const clientService = new ClientService();
export default clientService;
