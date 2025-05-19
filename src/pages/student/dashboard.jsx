import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '../../features/auth/authSlice';  // ✅ Corrected this line
import { Search, MessageSquare, Briefcase, ChevronRight, Bell, Clock, BookOpen } from 'lucide-react';

// Dashboard components
import ActivityFeed from '../../components/ActivityFeed';
import StatsCards from '../../components/StatsCards';

const StudentDashboard = () => {
  const user = useSelector(selectCurrentUser);  // ✅ Updated selector name here
  const [notifications, setNotifications] = useState(5);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}, {user?.name || 'Student'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome to your student dashboard
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <Bell className="h-6 w-6" />
            {notifications > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                {notifications}
              </span>
            )}
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <Clock className="h-6 w-6" />
          </button>
        </div>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/student/lost-found" className="dashboard-card hover:translate-y-[-5px] col-span-1 flex flex-col">
            <div className="card-header bg-blue-50 dark:bg-blue-900/20">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">Lost & Found</h3>
              <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="card-body flex-grow">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                Find lost items or report found ones across campus.
              </p>
              <div className="mt-2 text-sm font-medium flex items-center text-blue-600 dark:text-blue-400">
                <span>Explore</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
            <div className="card-footer text-xs text-gray-500 dark:text-gray-400">
              <span>10 new items today</span>
            </div>
          </Link>

          <Link to="/student/complaints" className="dashboard-card hover:translate-y-[-5px] col-span-1 flex flex-col">
            <div className="card-header bg-green-50 dark:bg-green-900/20">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">Complaints</h3>
              <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="card-body flex-grow">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                Submit and track complaints with efficient resolution.
              </p>
              <div className="mt-2 text-sm font-medium flex items-center text-green-600 dark:text-green-400">
                <span>View Services</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
            <div className="card-footer text-xs text-gray-500 dark:text-gray-400">
              <span>Coming soon</span>
            </div>
          </Link>

          <Link to="#" className="dashboard-card hover:translate-y-[-5px] col-span-1 flex flex-col">
            <div className="card-header bg-purple-50 dark:bg-purple-900/20">
              <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300">Placements</h3>
              <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="card-body flex-grow">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                Access campus placement opportunities and applications.
              </p>
              <div className="mt-2 text-sm font-medium flex items-center text-purple-600 dark:text-purple-400">
                <span>View Opportunities</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
            <div className="card-footer text-xs text-gray-500 dark:text-gray-400">
              <span>Coming soon</span>
            </div>
          </Link>
        </div>

        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Quick Resources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {['Academic Calendar', 'Campus Map', 'Library Services', 'Contact Directory'].map((item, index) => (
            <a 
              key={index}
              href="#"
              className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
            >
              <h3 className="font-medium text-gray-900 dark:text-white">{item}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Click to access</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
