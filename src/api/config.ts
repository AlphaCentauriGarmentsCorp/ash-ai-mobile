// API Configuration
export const API_CONFIG = {
  // Update this with your Laravel backend URL when ready
  BASE_URL: __DEV__ 
    ? 'http://localhost:8000/api' // Development - Update with your IP
    : 'https://your-production-api.com/api', // Production
  
  TIMEOUT: 30000, // 30 seconds
  
  // API Version - Use v2 for authenticated routes with middleware
  VERSION: 'v2',
  
  // API Endpoints
  ENDPOINTS: {
    // Auth (no version prefix)
    LOGIN: '/login',
    LOGIN_REEFER: '/login/reefer',
    LOGIN_SORBETES: '/login/sorbetes',
    REGISTER_REEFER: '/register/reefer',
    REGISTER_SORBETES: '/register/sorbetes',
    LOGOUT: '/logout',
    VERIFY_OTP: '/verify-otp',
    ME: '/me',
    PROFILE: '/profile',
    
    // V2 Protected Routes (with auth:sanctum middleware)
    // Users
    USERS: '/v2/users',
    USER_BY_ID: (id: string) => `/v2/users/${id}`,
    
    // Clients
    CLIENTS: '/v2/clients',
    CLIENT_BY_ID: (id: string) => `/v2/clients/${id}`,
    
    // Client Brands
    CLIENT_BRANDS: '/v2/client-brands',
    CLIENT_BRAND_BY_ID: (id: string) => `/v2/client-brands/${id}`,
    
    // Orders
    ORDERS: '/v2/orders',
    ORDER_BY_ID: (id: string) => `/v2/orders/${id}`,
    
    // Order Processes
    ORDER_PROCESSES: '/v2/order-processes',
    ORDER_PROCESS_BY_ID: (id: string) => `/v2/order-processes/${id}`,
    
    // Order Payments
    ORDER_PAYMENTS: '/v2/order-payments',
    ORDER_PAYMENT_BY_ID: (id: string) => `/v2/order-payments/${id}`,
    
    // PO Status
    PO_STATUSES: '/v2/po-statuses',
    PO_STATUS_BY_ID: (id: string) => `/v2/po-statuses/${id}`,
    
    // PO Items
    PO_ITEMS: '/v2/po-items',
    PO_ITEM_BY_ID: (id: string) => `/v2/po-items/${id}`,
    
    // Designs
    DESIGNS: '/v2/designs',
    DESIGN_BY_ID: (id: string) => `/v2/designs/${id}`,
    
    // Fabric Types
    FABRIC_TYPES: '/v2/fabric-types',
    FABRIC_TYPE_BY_ID: (id: string) => `/v2/fabric-types/${id}`,
    
    // Type Sizes
    TYPE_SIZES: '/v2/type-sizes',
    TYPE_SIZE_BY_ID: (id: string) => `/v2/type-sizes/${id}`,
    
    // Warehouse Materials
    WAREHOUSE_MATERIALS: '/v2/warehouse-materials',
    WAREHOUSE_MATERIAL_BY_ID: (id: string) => `/v2/warehouse-materials/${id}`,
    
    // Type Garments
    TYPE_GARMENTS: '/v2/type-garments',
    TYPE_GARMENT_BY_ID: (id: string) => `/v2/type-garments/${id}`,
    
    // Type Printing Methods
    TYPE_PRINTING_METHODS: '/v2/type-printing-methods',
    TYPE_PRINTING_METHOD_BY_ID: (id: string) => `/v2/type-printing-methods/${id}`,
  },
};

export default API_CONFIG;
