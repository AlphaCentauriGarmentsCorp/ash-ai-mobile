// Common API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  message?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  frontend_access?: 'ash' | 'sorbetes' | 'reefer';
  avatar?: string;
  created_at: string;
  updated_at: string;
}

// Client Types
export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  brand_name: string;
  logo?: string;
  street_address: string;
  city: string;
  province: string;
  postal_code: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClientRequest {
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  brand_name: string;
  logo?: File | null;
  street_address: string;
  city: string;
  province: string;
  postal_code: string;
  notes?: string;
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {
  id: string;
}

// Account Types
export interface Account {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CreateAccountRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateAccountRequest extends Partial<CreateAccountRequest> {
  id: string;
}

// Order Types
export interface Order {
  id: string;
  client_id: string;
  client?: Client;
  order_number: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total_amount: number;
  items: OrderItem[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface CreateOrderRequest {
  client_id: string;
  items: Omit<OrderItem, 'id' | 'subtotal'>[];
  notes?: string;
}

// File Upload Types
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mime_type: string;
}

// Client Brand Types
export interface ClientBrand {
  id: string;
  client_id: string;
  brand_name: string;
  logo?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClientBrandRequest {
  client_id: string;
  brand_name: string;
  logo?: File | null;
}

// Fabric Type
export interface FabricType {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Type Size
export interface TypeSize {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Warehouse Material
export interface WarehouseMaterial {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Type Garment
export interface TypeGarment {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Type Printing Method
export interface TypePrintingMethod {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Order Process
export interface OrderProcess {
  id: string;
  order_id: string;
  process_name: string;
  status: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// Order Payment
export interface OrderPayment {
  id: string;
  order_id: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

// PO Status
export interface PoStatus {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// PO Item
export interface PoItem {
  id: string;
  order_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  updated_at: string;
}

// Design
export interface Design {
  id: string;
  order_id: string;
  design_name: string;
  design_file?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
