import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { 
  MessageSquare, 
  Briefcase, 
  ChevronRight, 
  Bell, 
  Calendar, 
  Settings, 
  ShieldCheck,
  Megaphone,
  Filter
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const user = useSelector(selectCurrentUser);
  const [notifications, setNotifications] = useState(12);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <div className="flex items-center">
            <ShieldCheck className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {getGreeting()}, {user?.name || 'Administrator'}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1 pl-11">
            Super Administrator Dashboard
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <Bell className="h-6 w-6" />
            {notifications > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                {notifications}
              </span>
            )}
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <Calendar className="h-6 w-6" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <Settings className="h-6 w-6" />
          </button>
          <div className="bg-indigo-600 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Link to="/superadmin/complaints" className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Complaints</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">51</h3>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                +12% from last month
              </p>
            </div>
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </Link>
        
        <Link to="/superadmin/placements" className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Placements</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">28</h3>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                +8% from last week
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
              <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Link>
        
        <Link to="/superadmin/events" className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-amber-500 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Upcoming Events</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">15</h3>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                +20% from last month
              </p>
            </div>
            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
              <Megaphone className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
