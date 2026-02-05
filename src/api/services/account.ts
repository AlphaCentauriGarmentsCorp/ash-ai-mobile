import apiClient from '../client';
import API_CONFIG from '../config';
import {
    Account,
    ApiResponse,
    CreateAccountRequest,
    PaginatedResponse,
    UpdateAccountRequest,
} from '../types';

class AccountService {
  async getAccounts(page = 1, perPage = 10, search?: string): Promise<PaginatedResponse<Account>> {
    const params: any = { page, per_page: perPage };
    if (search) params.search = search;

    return await apiClient.get<PaginatedResponse<Account>>(
      API_CONFIG.ENDPOINTS.ACCOUNTS,
      { params }
    );
  }

  async getAccountById(id: string): Promise<Account> {
    const response = await apiClient.get<ApiResponse<Account>>(
      API_CONFIG.ENDPOINTS.ACCOUNT_BY_ID(id)
    );
    return response.data;
  }

  async createAccount(data: CreateAccountRequest): Promise<Account> {
    const response = await apiClient.post<ApiResponse<Account>>(
      API_CONFIG.ENDPOINTS.ACCOUNTS,
      data
    );
    return response.data;
  }

  async updateAccount(id: string, data: UpdateAccountRequest): Promise<Account> {
    const response = await apiClient.put<ApiResponse<Account>>(
      API_CONFIG.ENDPOINTS.ACCOUNT_BY_ID(id),
      data
    );
    return response.data;
  }

  async deleteAccount(id: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.ACCOUNT_BY_ID(id));
  }
}

export const accountService = new AccountService();
export default accountService;
