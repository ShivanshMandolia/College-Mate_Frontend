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
import ProtectedRoute from './pages/auth/ProtectedRoute.jsx';

// Public Pages
import HomePage from './components/HomePage.jsx';

// Student Pages
import StudentDashboard from './pages/student/dashboard.jsx';
import LostAndFoundPage from './pages/student/lostandfoundpage';
import FoundItemDetailPage from './pages/student/FoundItemDetailpage.jsx';
import LostItemDetailPage from './pages/student/LostItemDetailPage.jsx';
import MyLostListingsPage from './pages/student/MyLostRequests.jsx';
import PostFoundItem from './pages/student/postfounditem';
import PostLostRequest from './pages/student/postlostitempage';
import MyFoundListingsPage from './pages/student/mylistings.jsx';
import ComplaintDetail from './pages/student/ComplaintDetail.jsx';
import MyComplaints from './pages/student/MyComplaints.jsx';
import CreateComplaint from './pages/student/CreateComplaint.jsx';
import StudentPlacementsPage from './pages/student/placementpage.jsx';
import PlacementDetailPage from './pages/student/PlacementDetail.jsx';
import PlacementRegistrationPage from './pages/student/PlacementRegister.jsx';
import StudentEventsPage from './pages/student/eventpage.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/dashboard';
import AdminComplaintsList from './pages/admin/admincomplainents.jsx';
import AdminComplaintDetail from './pages/admin/AdminComplaintsView.jsx';
import PlacementDashboard from './pages/admin/PlacementDashboard.jsx';
import PlacementUpdate from './pages/admin/PlacementUpdate.jsx';
import EventsMainPage from './pages/admin/EventsMainPage.jsx';
import CreateEventPage from './pages/admin/PostEventsPage.jsx';
import UpdateEventPage from './pages/admin/UpdateEventPage.jsx';

// Super Admin Pages
import SuperAdminDashboard from './pages/superadmin/dashboard';
import ComplaintDetail1 from './pages/superadmin/ComplaintDetail.jsx';
import ComplaintsList from './pages/superadmin/ComplaintPage.jsx';
import AssignComplaint from './pages/superadmin/AdminAssign.jsx';
import PlacementList from './pages/superadmin/placementmainpage.jsx';
import CreatePlacement from './pages/superadmin/CreatePlacement.jsx';
import PlacementDetails from './pages/admin/PlacementDetails.jsx';

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
  else if (userRole === 'admin') {
    return <Navigate to="/admin/dashboard" />;
  }
  else {
    return <Navigate to="/student/dashboard" />;
  }
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
            <Route path="auth" element={<AuthWrapper />} />

            {/* Student Routes - Fixed: Remove nested Routes */}
            <Route path="student/dashboard" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="student/lost-found" element={
              <ProtectedRoute allowedRoles={['student']}>
                <LostAndFoundPage />
              </ProtectedRoute>
            } />
            <Route path="student/found-item/:itemId" element={
              <ProtectedRoute allowedRoles={['student']}>
                <FoundItemDetailPage />
              </ProtectedRoute>
            } />
            <Route path="student/lost-item/:itemId" element={
              <ProtectedRoute allowedRoles={['student']}>
                <LostItemDetailPage />
              </ProtectedRoute>
            } />
            <Route path="student/my-lost-listings" element={
              <ProtectedRoute allowedRoles={['student']}>
                <MyLostListingsPage />
              </ProtectedRoute>
            } />
            <Route path="student/post-found-item" element={
              <ProtectedRoute allowedRoles={['student']}>
                <PostFoundItem />
              </ProtectedRoute>
            } />
            <Route path="student/my-found-listings" element={
              <ProtectedRoute allowedRoles={['student']}>
                <MyFoundListingsPage />
              </ProtectedRoute>
            } />
            <Route path="student/post-lost-item" element={
              <ProtectedRoute allowedRoles={['student']}>
                <PostLostRequest />
              </ProtectedRoute>
            } />
            <Route path="student/complaints" element={
              <ProtectedRoute allowedRoles={['student']}>
                <MyComplaints />
              </ProtectedRoute>
            } />
            <Route path="student/complaints/create" element={
              <ProtectedRoute allowedRoles={['student']}>
                <CreateComplaint />
              </ProtectedRoute>
            } />
            <Route path="student/complaints/:complaintId" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ComplaintDetail />
              </ProtectedRoute>
            } />
            <Route path="student/placements" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentPlacementsPage />
              </ProtectedRoute>
            } />
            <Route path="student/placements/:placementId" element={
              <ProtectedRoute allowedRoles={['student']}>
                <PlacementDetailPage />
              </ProtectedRoute>
            } />
            <Route path="student/placements/:placementId/register" element={
              <ProtectedRoute allowedRoles={['student']}>
                <PlacementRegistrationPage />
              </ProtectedRoute>
            } />
            <Route path="student/events" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentEventsPage />
              </ProtectedRoute>
            } />

            {/* Admin Routes - Fixed: Remove nested Routes */}
            <Route path="admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="admin/placements" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PlacementDashboard />
              </ProtectedRoute>
            } />
            <Route path="admin/complaints" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminComplaintsList />
              </ProtectedRoute>
            } />
            <Route path="admin/placements/:placementId" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PlacementDetails />
              </ProtectedRoute>
            } />
            <Route path="admin/placements/:placementId/update" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PlacementUpdate />
              </ProtectedRoute>
            } />
            <Route path="admin/complaints/:complaintId" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminComplaintDetail />
              </ProtectedRoute>
            } />
            <Route path="admin/events" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EventsMainPage />
              </ProtectedRoute>
            } />
            <Route path="admin/events/create" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CreateEventPage />
              </ProtectedRoute>
            } />
            <Route path="admin/events/update/:eventId" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UpdateEventPage />
              </ProtectedRoute>
            } />

            {/* Super Admin Routes - Fixed: Remove nested Routes */}
            <Route path="superadmin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']} requireSuperAdmin={true}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="superadmin/complaints" element={
              <ProtectedRoute allowedRoles={['admin']} requireSuperAdmin={true}>
                <ComplaintsList />
              </ProtectedRoute>
            } />
            <Route path="superadmin/complaints/:complaintId" element={
              <ProtectedRoute allowedRoles={['admin']} requireSuperAdmin={true}>
                <ComplaintDetail1 />
              </ProtectedRoute>
            } />
            <Route path="superadmin/assign-complaint/:complaintId" element={
              <ProtectedRoute allowedRoles={['admin']} requireSuperAdmin={true}>
                <AssignComplaint />
              </ProtectedRoute>
            } />
            <Route path="superadmin/placements" element={
              <ProtectedRoute allowedRoles={['admin']} requireSuperAdmin={true}>
                <PlacementList />
              </ProtectedRoute>
            } />
            <Route path="superadmin/create" element={
              <ProtectedRoute allowedRoles={['admin']} requireSuperAdmin={true}>
                <CreatePlacement />
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