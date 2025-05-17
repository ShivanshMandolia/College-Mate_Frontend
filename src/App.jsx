import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole, selectIsSuperAdmin } from './features/auth/authSlice';

// Layout Components
import Layout from './Layout';

// Auth Components
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './auth/ProtectedRoute';

// Public Pages
import HomePage from './components/HomePage.jsx';

// Student Pages
import StudentDashboard from './pages/student/dashboard';
import ComplainentPage from './pages/student/complainentpage';
import CreateComplainent from './pages/student/createcomplainent';
import EventPage from './pages/student/eventpage';
import LostAndFoundPage from './pages/student/lostandfoundpage';
import PlacementPage from './pages/student/placementpage';
import PlacementDetailPage from './pages/student/placementdetailpage';
import PostFoundItem from './pages/student/postfounditem';
import PostLostItemPage from './pages/student/postlostitempage';
import ResumeAnalyzer from './pages/student/resumeanalyzer';

// Admin Pages
import AdminDashboard from './pages/admin/dashboard';
import AdminComplaints from './pages/admin/admincomplainents';
import CreateEventPage from './pages/admin/createeventpage';
import GetAllEventsPage from './pages/admin/getalleventspage';

// Super Admin Pages
import SuperAdminDashboard from './pages/superadmin/dashboard';
import AddPlacement from './pages/superadmin/addplacement';
import ComplaintDetail from './pages/superadmin/complainentdetail';
import ComplaintPage from './pages/superadmin/complanetpage';

// ScrollToTop component to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Authentication wrapper that checks user role and redirects accordingly
const AuthWrapper = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const isSuperAdmin = useSelector(selectIsSuperAdmin);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isSuperAdmin) {
    return <Navigate to="/superadmin/dashboard" />;
  }

  if (userRole === 'admin') {
    return <Navigate to="/admin/dashboard" />;
  }

  return <Navigate to="/student/dashboard" />;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            
            {/* Auth redirect */}
            <Route path="/auth" element={<AuthWrapper />} />

            {/* Student Routes */}
            <Route path="student/*" element={
              <ProtectedRoute allowedRoles={['student']}>
                <Routes>
                  <Route path="dashboard" element={<StudentDashboard />} />
                  <Route path="complaints" element={<ComplainentPage />} />
                  <Route path="create-complaint" element={<CreateComplainent />} />
                  <Route path="events" element={<EventPage />} />
                  <Route path="lost-found" element={<LostAndFoundPage />} />
                  <Route path="placements" element={<PlacementPage />} />
                  <Route path="placements/:id" element={<PlacementDetailPage />} />
                  <Route path="post-found-item" element={<PostFoundItem />} />
                  <Route path="post-lost-item" element={<PostLostItemPage />} />
                  <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
                </Routes>
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="admin/*" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="complaints" element={<AdminComplaints />} />
                  <Route path="create-event" element={<CreateEventPage />} />
                  <Route path="events" element={<GetAllEventsPage />} />
                </Routes>
              </ProtectedRoute>
            } />

            {/* Super Admin Routes */}
            <Route path="superadmin/*" element={
              <ProtectedRoute allowedRoles={['superadmin']} requireSuperAdmin={true}>
                <Routes>
                  <Route path="dashboard" element={<SuperAdminDashboard />} />
                  <Route path="add-placement" element={<AddPlacement />} />
                  <Route path="complaint-detail/:id" element={<ComplaintDetail />} />
                  <Route path="complaints" element={<ComplaintPage />} />
                </Routes>
              </ProtectedRoute>
            } />

            {/* Catch all - 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;