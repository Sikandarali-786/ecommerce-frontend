// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// Category types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// Product types
export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  weight?: number;
  images: string[];
  category: Category | string;
  createdBy: User | string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
}

export interface SingleProductResponse {
  success: boolean;
  product: Product;
}

export interface CategoriesResponse {
  success: boolean;
  categories: Category[];
}

// Review types
export interface Review {
  _id: string;
  product: string;
  user: { _id: string; name: string };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  success: boolean;
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
}
