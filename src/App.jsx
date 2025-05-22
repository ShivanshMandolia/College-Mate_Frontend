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
import StudentDashboard from './pages/student/dashboard';
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


// Admin Pages
import AdminDashboard from './pages/admin/dashboard';
import AdminComplaintsList from './pages/admin/admincomplainents.jsx';
import AdminComplaintDetail from './pages/admin/AdminComplaintsView.jsx';
import PlacementDashboard from './pages/admin/PlacementDashboard.jsx';
import PlacementUpdate from './pages/admin/PlacementUpdate.jsx';

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

  else return <Navigate to="/student/dashboard" />;
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
                  <Route path="lost-found" element={<LostAndFoundPage />} />
                  <Route path="found-item/:itemId" element={<FoundItemDetailPage />} />
                  <Route path="lost-item/:itemId" element={<LostItemDetailPage />} />
                  <Route path="my-lost-listings" element={<MyLostListingsPage />} />
                  <Route path="post-found-item" element={<PostFoundItem />} />
                  <Route path="my-found-listings" element={<MyFoundListingsPage />} />   
                  <Route path="post-lost-item" element={<PostLostRequest />} />
                  <Route path="complaints" element={<MyComplaints />} />
                  <Route path="complaints/create" element={<CreateComplaint />} />
                  <Route path="complaints/:complaintId" element={<ComplaintDetail />} />
                   <Route path="placements" element={<StudentPlacementsPage />} />
                    <Route path="placements/:placementId" element={<PlacementDetailPage />} />
                   <Route path="placements/:placementId/register" element={<PlacementRegistrationPage />} />

                </Routes>
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="admin/*" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                   <Route path="placements" element={<PlacementDashboard />} />
                   <Route path="placements" element={<PlacementList />} />
                    <Route path="complaints" element={<AdminComplaintsList />} />

 <Route path="placements/:placementId" element={<PlacementDetails />} />
                    <Route path="placements/:placementId/update" element={<PlacementUpdate />} />

                      <Route path="complaints/:complaintId" element={<AdminComplaintDetail />} />

                
                </Routes>
              </ProtectedRoute>
            } />

            {/* Super Admin Routes */}
            <Route path="superadmin/*" element={
              <ProtectedRoute allowedRoles={['admin']} requireSuperAdmin={true}>
                <Routes>
                  <Route path="dashboard" element={<SuperAdminDashboard />} />
                   <Route path="complaints" element={<ComplaintsList />} />
                  <Route path="complaints/:complaintId" element={<ComplaintDetail1 />} />
                      <Route path="assign-complaint/:complaintId" element={<AssignComplaint />} />
                      <Route path="placements" element={<PlacementList />} />
                      <Route path="create" element={<CreatePlacement />} />

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