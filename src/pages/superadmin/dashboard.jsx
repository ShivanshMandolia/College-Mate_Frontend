import { MessageSquare, Briefcase, Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';

const SuperAdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Super Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link to="#" className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Complaints</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">51</h3>
            </div>
            <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
        </Link>

        <Link to="#" className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Placements</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">28</h3>
            </div>
            <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
        </Link>

        <Link to="#" className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Events</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">15</h3>
            </div>
            <Megaphone className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
