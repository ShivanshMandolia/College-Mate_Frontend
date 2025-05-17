import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole, selectIsSuperAdmin } from '../../features/auth/authSlice';

/**
 * ProtectedRoute component that restricts access based on user authentication and role.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.allowedRoles - Array of roles that can access this route
 * @param {boolean} props.requireSuperAdmin - Whether the route requires super admin privileges
 * @param {React.ReactNode} props.children - Child components to render if access is allowed
 */
const ProtectedRoute = ({ allowedRoles, requireSuperAdmin = false, children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const isSuperAdmin = useSelector(selectIsSuperAdmin);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based permissions
  const hasRequiredRole = allowedRoles ? allowedRoles.includes(userRole) : true;
  
  // Check super admin requirement
  const hasSuperAdminAccess = requireSuperAdmin ? isSuperAdmin : true;

  // If user doesn't have required role or superadmin status, redirect to appropriate dashboard
  if (!hasRequiredRole || !hasSuperAdminAccess) {
    if (isSuperAdmin) {
      return <Navigate to="/superadmin/dashboard" replace />;
    } else if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  // If all checks pass, render the protected content
  return children;
};

export default ProtectedRoute;