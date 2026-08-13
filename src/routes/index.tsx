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
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));
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
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));
const CategoriesPage = lazy(() => import('../pages/categories/CategoriesPage'));
const RefundPolicyPage = lazy(() => import('../pages/RefundPolicy/RefundPolicyPage'));
const ShippingPolicyPage = lazy(() => import('../pages/ShippingPolicy/ShippingPolicyPage'));
const ContactPage = lazy(() => import('../pages/Contact/ContactPage'));
const AboutPage = lazy(() => import('../pages/About/AboutPage'));

// Wrapper component for Suspense
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  // ─── Public / User routes (with Navbar + Footer) ───────────────────────────
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <SuspenseWrapper><HomePage /></SuspenseWrapper>,
      },
      {
        path: 'login',
        element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
      },
      {
        path: 'register',
        element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper>,
      },
      {
        path: 'forgot-password',
        element: <SuspenseWrapper><ForgotPasswordPage /></SuspenseWrapper>,
      },
      {
        path: 'reset-password/:token',
        element: <SuspenseWrapper><ResetPasswordPage /></SuspenseWrapper>,
      },
      {
        path: 'categories',
        element: <SuspenseWrapper><CategoriesPage /></SuspenseWrapper>,
      },
      {
        path: 'refund-policy',
        element: <SuspenseWrapper><RefundPolicyPage /></SuspenseWrapper>,
      },
      {
        path: 'shipping-policy',
        element: <SuspenseWrapper><ShippingPolicyPage /></SuspenseWrapper>,
      },
      {
        path: 'contact',
        element: <SuspenseWrapper><ContactPage /></SuspenseWrapper>,
      },
      {
        path: 'about',
        element: <SuspenseWrapper><AboutPage /></SuspenseWrapper>,
      },
      {
        path: 'products',
        element: <SuspenseWrapper><ProductsPage /></SuspenseWrapper>,
      },
      {
        path: 'products/:id',
        element: <SuspenseWrapper><ProductDetailPage /></SuspenseWrapper>,
      },
      {
        path: 'cart',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute><CartPage /></ProtectedRoute>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'wishlist',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute><WishlistPage /></ProtectedRoute>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'checkout',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute><CheckoutPage /></ProtectedRoute>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'order-success/:orderId',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute><OrderSuccessPage /></ProtectedRoute>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'orders',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute><OrdersPage /></ProtectedRoute>
          </SuspenseWrapper>
        ),
      },
      {
        path: 'profile',
        element: (
          <SuspenseWrapper>
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          </SuspenseWrapper>
        ),
      },
      {
        path: '*',
        element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper>,
      },
    ],
  },

  // ─── Admin panel (sidebar layout, no store navbar/footer) ──────────────────
  {
    path: '/admin',
    element: (
      <SuspenseWrapper>
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      </SuspenseWrapper>
    ),
    children: [
      {
        index: true,
        element: <SuspenseWrapper><AdminDashboardPage /></SuspenseWrapper>,
      },
      {
        path: 'products',
        element: <SuspenseWrapper><AdminProductsPage /></SuspenseWrapper>,
      },
      {
        path: 'categories',
        element: <SuspenseWrapper><AdminCategoriesPage /></SuspenseWrapper>,
      },
      {
        path: 'orders',
        element: <SuspenseWrapper><AdminOrdersPage /></SuspenseWrapper>,
      },
      {
        path: 'users',
        element: <SuspenseWrapper><AdminUsersPage /></SuspenseWrapper>,
      },
    ],
  },
]);
