import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole, selectIsSuperAdmin } from '../features/auth/authSlice';

const HomePage = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const isSuperAdmin = useSelector(selectIsSuperAdmin);

  const getDashboardLink = () => {
    if (isSuperAdmin) return '/superadmin/dashboard';
    if (userRole === 'admin') return '/admin/dashboard';
    return '/student/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Welcome to</span>
                  <span className="block text-blue-600">College Mate</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Your all-in-one platform for managing college life. From complaints to events, lost and found to placements, we've got you covered.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  {isAuthenticated ? (
                    <div className="rounded-md shadow">
                      <Link
                        to={getDashboardLink()}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                      >
                        Go to Dashboard
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-md shadow">
                        <Link
                          to="/login"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                        >
                          Login
                        </Link>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <Link
                          to="/register"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                        >
                          Register
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need in one place
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Complaints Feature */}
              <div className="relative">
                <div className="relative bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">Complaints Management</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Easy submission and tracking of complaints with real-time updates.
                  </p>
                </div>
              </div>

              {/* Events Feature */}
              <div className="relative">
                <div className="relative bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">Events Portal</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Stay updated with college events and manage your participation.
                  </p>
                </div>
              </div>

              {/* Lost and Found Feature */}
              <div className="relative">
                <div className="relative bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">Lost and Found</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Report lost items or help others find their belongings.
                  </p>
                </div>
              </div>

              {/* Placements Feature */}
              <div className="relative">
                <div className="relative bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">Placements</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Access placement opportunities and track your applications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;