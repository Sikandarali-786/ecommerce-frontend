import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
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
const OrderSuccessPage = lazy(() => import('../pages/order/OrderSuccessPage'));
const OrdersPage = lazy(() => import('../pages/order/OrdersPage'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('../pages/admin/AdminProductsPage'));
const AdminCategoriesPage = lazy(() => import('../pages/admin/AdminCategoriesPage'));
const AdminOrdersPage = lazy(() => import('../pages/admin/AdminOrdersPage'));
const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage'));
const AdminPlaceholderPage = lazy(() => import('../pages/admin/AdminPlaceholderPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Wrapper component for Suspense
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
);

const adminSuspense = (element: React.ReactNode) => (
  <SuspenseWrapper>
    <AdminRoute>{element}</AdminRoute>
  </SuspenseWrapper>
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
      {
        path: 'order-success/:orderId',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute>
              <OrderSuccessPage />
            </ProtectedRoute>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'orders',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
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

  // Admin panel — separate layout with sidebar (no store navbar/footer)
  {
    path: '/admin',
    element: adminSuspense(<AdminLayout />),
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <AdminDashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'categories',
        element: (
          <SuspenseWrapper>
            <AdminCategoriesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'products',
        element: (
          <SuspenseWrapper>
            <AdminProductsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'orders',
        element: (
          <SuspenseWrapper>
            <AdminOrdersPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'users',
        element: (
          <SuspenseWrapper>
            <AdminUsersPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]);
