// API Endpoints Configuration

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
  },

  // User endpoints
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
    ADMIN: '/user/admin',
    ADMIN_STATS: '/user/admin/stats',
    ADMIN_USERS: '/user/admin/users',
    ADMIN_USER_BY_ID: (id: string) => `/user/admin/users/${id}`,
    ADMIN_UPDATE_ROLE: (id: string) => `/user/admin/users/${id}/role`,
    ADMIN_TOGGLE_STATUS: (id: string) => `/user/admin/users/${id}/toggle-status`,
    ADMIN_DELETE_USER: (id: string) => `/user/admin/users/${id}`,
  },

  // Category endpoints
  CATEGORY: {
    GET_ALL: '/categories',
    CREATE: '/categories/create',
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
  },

  // Product endpoints
  PRODUCT: {
    GET_ALL: '/product',
    GET_BY_ID: (id: string) => `/product/${id}`,
    CREATE: '/product/create',
    UPDATE: (id: string) => `/product/${id}`,
    DELETE: (id: string) => `/product/${id}`,
  },

  // Cart endpoints
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: (productId: string) => `/cart/remove/${productId}`,
    CLEAR: '/cart/clear',
  },

  // Wishlist endpoints
  WISHLIST: {
    GET: '/wishlist',
    ADD: '/wishlist/add',
    REMOVE: (productId: string) => `/wishlist/remove/${productId}`,
    CLEAR: '/wishlist/clear',
  },

  // Order endpoints
  ORDER: {
    CREATE: '/orders/create',
    MY_ORDERS: '/orders/my-orders',
    GET_BY_ID: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    // Admin endpoints
    ADMIN_GET_ALL: '/orders',
    ADMIN_UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
  },
} as const;
