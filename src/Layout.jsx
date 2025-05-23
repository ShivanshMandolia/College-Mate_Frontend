import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole, selectIsSuperAdmin } from './features/auth/authSlice';
import {Header} from './components/Header';
import {Footer} from './components/Footer';
import MobileNav from './components/Mobilenav';

const Layout = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const isSuperAdmin = useSelector(selectIsSuperAdmin);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      {/* Add padding-top to account for fixed header height (h-20 = 5rem = 80px) */}
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
      {isAuthenticated && <MobileNav userRole={userRole} isSuperAdmin={isSuperAdmin} />}
    </div>
  );
};

export default Layout;