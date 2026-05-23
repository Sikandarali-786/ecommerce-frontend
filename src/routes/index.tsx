import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';
import LoadingSpinner from '../components/LoadingSpinner';

// Lazy load pages
const HomePage = lazy(() => import('../pages/home/HomePage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ProductsPage = lazy(() => import('../pages/products/ProductsPage'));
const ProductDetailPage = lazy(() => import('../pages/products/ProductDetailPage'));
const CartPage = lazy(() => import('../pages/cart/CartPage'));
const WishlistPage = lazy(() => import('../pages/wishlist/WishlistPage'));
const CheckoutPage = lazy(() => import('../pages/checkout/CheckoutPage'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Wrapper component for Suspense
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Public routes
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <HomePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'login',
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'register',
        element: (
          <SuspenseWrapper>
            <RegisterPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'products',
        element: (
          <SuspenseWrapper>
            <ProductsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'products/:id',
        element: (
          <SuspenseWrapper>
            <ProductDetailPage />
          </SuspenseWrapper>
        ),
      },

      // Protected routes (require authentication)
      {
        path: 'cart',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'wishlist',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'checkout',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          </SuspenseWrapper>
        ),
      },

      // Admin routes (require admin role)
      {
        path: 'admin',
        element: (
          <SuspenseWrapper>
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </SuspenseWrapper>
        ),
      },

      // 404 Not Found
      {
        path: '*',
        element: (
          <SuspenseWrapper>
            <NotFoundPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]);
