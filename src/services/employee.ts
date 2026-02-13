import apiClient from '../api/client';
import API_CONFIG from '../api/config';
import type { Account, CreateAccountRequest, PaginatedResponse, UpdateAccountRequest } from '../api/types';

class EmployeeService {
  // Get all employees with pagination
  async getEmployees(page = 1, perPage = 15, search?: string): Promise<PaginatedResponse<Account>> {
    const params: Record<string, any> = {
      page,
      per_page: perPage,
    };

    if (search) {
      params.search = search;
    }

    return await apiClient.get<PaginatedResponse<Account>>(API_CONFIG.ENDPOINTS.EMPLOYEES, { params });
  }

  // Get single employee by ID
  async getEmployeeById(id: string): Promise<Account> {
    return await apiClient.get<Account>(API_CONFIG.ENDPOINTS.EMPLOYEE_BY_ID(Number(id)));
  }

  // Create new employee
  async createEmployee(data: CreateAccountRequest): Promise<Account> {
    return await apiClient.post<Account>(API_CONFIG.ENDPOINTS.EMPLOYEES, data);
  }

  // Update employee
  async updateEmployee(id: string, data: UpdateAccountRequest): Promise<Account> {
    return await apiClient.put<Account>(API_CONFIG.ENDPOINTS.EMPLOYEE_BY_ID(Number(id)), data);
  }

  // Delete employee
  async deleteEmployee(id: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.EMPLOYEE_BY_ID(Number(id)));
  }
}

export const employeeService = new EmployeeService();
export default employeeService;
