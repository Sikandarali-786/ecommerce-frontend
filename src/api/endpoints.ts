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
    ADMIN: '/user/admin',
  },

  // Category endpoints
  CATEGORY: {
    GET_ALL: '/categories',
    CREATE: '/categories/create',
  },

  // Product endpoints
  PRODUCT: {
    GET_ALL: '/product',
    GET_BY_ID: (id: string) => `/product/${id}`,
    CREATE: '/product/create',
    UPDATE: (id: string) => `/product/${id}`,
    DELETE: (id: string) => `/product/${id}`,
  },
} as const;
