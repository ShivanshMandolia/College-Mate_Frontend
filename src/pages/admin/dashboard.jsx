import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { 
  MessageSquare, 
  Briefcase, 
  Megaphone,
  ShieldCheck,
  Bell,
  Calendar,
  Settings
} from 'lucide-react';

const AdminDashboard = () => {
  const user = useSelector(selectCurrentUser);
  const [notifications, setNotifications] = useState(5);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center">
          <ShieldCheck className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {getGreeting()}, {user?.name || 'Admin'}
          </h1>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <button className="relative p-2 text-gray-500 hover:text-gray-700">
            <Bell className="h-6 w-6" />
            {notifications > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2">
                {notifications}
              </span>
            )}
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <Calendar className="h-6 w-6" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <Settings className="h-6 w-6" />
          </button>
          <div className="bg-indigo-600 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link to="/admin/complaints" className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Assigned Complaints</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">24</h3>
              <p className="text-xs text-green-600 mt-2">+5% from last week</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </Link>

        <Link to="/admin/events" className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Events</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">12</h3>
              <p className="text-xs text-green-600 mt-2">+10% from last month</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-lg">
              <Megaphone className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </Link>

        <Link to="/admin/placements" className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Placements</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">30</h3>
              <p className="text-xs text-green-600 mt-2">+7% from last week</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Briefcase className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
