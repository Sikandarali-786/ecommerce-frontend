import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../utils/auth';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const location = useLocation();

  if (!isAuthenticated() || !isAdmin()) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }

  return <>{children}</>;
};

export default AdminRoute;
