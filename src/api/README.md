# API Module 🚀

This folder contains all API-related code for communicating with the Laravel backend.

## 📁 Structure

```
src/api/
├── client.ts              # HTTP client with interceptors & token management
├── config.ts              # API base URL and endpoints
├── types.ts               # TypeScript interfaces for API
├── index.ts               # Main exports
└── services/
    ├── auth.ts            # Authentication service
    ├── client.ts          # Client CRUD operations
    ├── account.ts         # Account management
    ├── order.ts           # Order management
    └── index.ts           # Service exports
```

## 🎯 Quick Start

### Import API Services

```typescript
import { authService, clientService, accountService, orderService } from '@api';
// or
import { authService } from '@api/services/auth';
```

### Import Types

```typescript
import { Client, Order, ApiResponse, PaginatedResponse } from '@api';
```

### Import Config

```typescript
import API_CONFIG from '@api/config';
```

## 📝 Usage Examples

### Authentication

```typescript
import { authService } from '@api';

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Logout
await authService.logout();

// Check authentication
const isAuth = await authService.isAuthenticated();
```

### CRUD Operations

```typescript
import { clientService } from '@api';

// Get list with pagination
const clients = await clientService.getClients(1, 10, 'search term');

// Get single item
const client = await clientService.getClientById('123');

// Create
const newClient = await clientService.createClient({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  // ... other fields
});

// Update
const updated = await clientService.updateClient('123', {
  first_name: 'Jane',
});

// Delete
await clientService.deleteClient('123');
```

### File Upload

```typescript
import { clientService } from '@api';
import { createFormDataFile } from '@utils/fileHelper';

const formData = {
  ...clientData,
  logo: createFormDataFile(imageAsset),
};

const client = await clientService.createClient(formData);
```

## ⚙️ Configuration

### Update API URL

Edit `src/api/config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://YOUR_IP:8000/api'  // Development
    : 'https://api.production.com/api',  // Production
  // ...
};
```

### Add New Endpoints

```typescript
ENDPOINTS: {
  // Add your endpoints here
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: string) => `/products/${id}`,
}
```

## 🔐 Token Management

The API client automatically handles:
- ✅ Token storage in AsyncStorage
- ✅ Auto-injection in request headers
- ✅ Token refresh on 401 errors
- ✅ Request queuing during refresh

## 🛠️ Creating New Services

1. Create service file in `services/` folder
2. Import `apiClient` and types
3. Export service instance

```typescript
// src/api/services/product.ts
import API_CONFIG from '../config';
import { Product, ApiResponse } from '../types';
import apiClient from '../client';

class ProductService {
  async getProducts() {
    return await apiClient.get<ApiResponse<Product[]>>(
      API_CONFIG.ENDPOINTS.PRODUCTS
    );
  }
}

export const productService = new ProductService();
```

4. Export from `services/index.ts`:

```typescript
export { productService } from './product';
```

## 📦 Available Services

- **authService** - Login, logout, password reset, OTP
- **clientService** - Client CRUD with file upload
- **accountService** - Account management
- **orderService** - Order management with status updates

## 🔄 Response Format

Expected Laravel response format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Paginated:
```json
{
  "data": [...],
  "current_page": 1,
  "last_page": 5,
  "per_page": 10,
  "total": 50
}
```

## 🚨 Error Handling

All API errors are automatically caught and formatted. Use with hooks:

```typescript
import { useApi } from '@hooks';
import { clientService } from '@api';

const { data, loading, error, execute } = useApi(clientService.getClients);

if (error) {
  console.log(error.message);
  console.log(error.errors); // Validation errors
  console.log(error.status); // HTTP status code
}
```

## 📚 Related Files

- **Hooks**: `src/hooks/useApi.ts` - API call hook with loading/error states
- **Utils**: `src/utils/errorHandler.ts` - Error alert helpers
- **Utils**: `src/utils/fileHelper.ts` - File upload helpers
- **Components**: `src/components/common/FileUpload.tsx` - File upload component

## 💡 Tips

- Always use TypeScript interfaces for type safety
- Use the `useApi` hook for automatic loading/error states
- Test endpoints individually before integration
- Check Laravel logs for backend errors
- Enable CORS in Laravel for development
