import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole, selectIsSuperAdmin } from '../../features/auth/authSlice';

const ProtectedRoute = ({ allowedRoles, requireSuperAdmin = false, children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const isSuperAdmin = useSelector(selectIsSuperAdmin);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // For superadmin routes
  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  // For role-based routes
  if (allowedRoles && !allowedRoles.includes(userRole) && !isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;