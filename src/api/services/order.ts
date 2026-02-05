import apiClient from '../client';
import API_CONFIG from '../config';
import {
    ApiResponse,
    CreateOrderRequest,
    Order,
    PaginatedResponse,
} from '../types';

class OrderService {
  async getOrders(
    page = 1, 
    perPage = 10, 
    filters?: {
      status?: string;
      client_id?: string;
      search?: string;
    }
  ): Promise<PaginatedResponse<Order>> {
    const params: any = { page, per_page: perPage, ...filters };

    return await apiClient.get<PaginatedResponse<Order>>(
      API_CONFIG.ENDPOINTS.ORDERS,
      { params }
    );
  }

  async getOrderById(id: string): Promise<Order> {
    const response = await apiClient.get<ApiResponse<Order>>(
      API_CONFIG.ENDPOINTS.ORDER_BY_ID(id)
    );
    return response.data;
  }

  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await apiClient.post<ApiResponse<Order>>(
      API_CONFIG.ENDPOINTS.ORDERS,
      data
    );
    return response.data;
  }

  async updateOrder(id: string, data: Partial<CreateOrderRequest>): Promise<Order> {
    const response = await apiClient.put<ApiResponse<Order>>(
      API_CONFIG.ENDPOINTS.ORDER_BY_ID(id),
      data
    );
    return response.data;
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const response = await apiClient.patch<ApiResponse<Order>>(
      `${API_CONFIG.ENDPOINTS.ORDER_BY_ID(id)}/status`,
      { status }
    );
    return response.data;
  }

  async deleteOrder(id: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.ORDER_BY_ID(id));
  }
}

export const orderService = new OrderService();
export default orderService;
