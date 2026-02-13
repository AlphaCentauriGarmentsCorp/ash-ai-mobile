import apiClient from '../client';
import API_CONFIG from '../config';
import type { Client, CreateClientRequest, PaginatedResponse, UpdateClientRequest } from '../types';

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
    return await apiClient.post<Client>(API_CONFIG.ENDPOINTS.CLIENTS, data);
  }

  // Update client
  async updateClient(id: string, data: UpdateClientRequest): Promise<Client> {
    return await apiClient.put<Client>(API_CONFIG.ENDPOINTS.CLIENT_BY_ID(Number(id)), data);
  }

  // Delete client
  async deleteClient(id: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.CLIENT_BY_ID(Number(id)));
  }
}

export const clientService = new ClientService();
export default clientService;
