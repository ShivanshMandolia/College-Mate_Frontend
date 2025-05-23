import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { 
  Search, 
  MessageSquare, 
  Briefcase, 
  ChevronRight, 
  Bell, 
  Clock, 
  BookOpen,
  Calendar,
  TrendingUp,
  Users,
  Award,
  MapPin,
  Phone,
  Library,
  Map,
  AlertCircle,
  CheckCircle,
  Star
} from 'lucide-react';

// Dashboard components
import ActivityFeed from '../../components/ActivityFeed';

const StudentDashboard = () => {
  const user = useSelector(selectCurrentUser);
  const [notifications, setNotifications] = useState(5);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Quick stats for the main services
  const serviceStats = {
    lostFound: { total: 45, recent: 8, resolved: 37 },
    placements: { active: 23, applied: 5, upcoming: 12 },
    complaints: { pending: 3, resolved: 15, total: 18 },
    events: { upcoming: 7, registered: 4, total: 25 }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {getGreeting()}, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Your personalized campus dashboard
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-sm">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <button className="relative p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
              <Bell className="h-6 w-6" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full animate-pulse">
                  {notifications}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Lost & Found Items</p>
                <p className="text-3xl font-bold">{serviceStats.lostFound.total}</p>
                <p className="text-blue-100 text-xs mt-1">{serviceStats.lostFound.recent} new today</p>
              </div>
              <Search className="h-8 w-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Active Placements</p>
                <p className="text-3xl font-bold">{serviceStats.placements.active}</p>
                <p className="text-green-100 text-xs mt-1">{serviceStats.placements.upcoming} upcoming</p>
              </div>
              <Briefcase className="h-8 w-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">My Complaints</p>
                <p className="text-3xl font-bold">{serviceStats.complaints.total}</p>
                <p className="text-orange-100 text-xs mt-1">{serviceStats.complaints.pending} pending</p>
              </div>
              <MessageSquare className="h-8 w-8 text-orange-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Campus Events</p>
                <p className="text-3xl font-bold">{serviceStats.events.total}</p>
                <p className="text-purple-100 text-xs mt-1">{serviceStats.events.upcoming} upcoming</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Main Service Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {/* Lost & Found Card */}
          <Link 
            to="/student/lost-found" 
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{serviceStats.lostFound.recent}</p>
                  <p className="text-xs text-blue-500 dark:text-blue-300">New Items</p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Lost & Found</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Find lost items or report found ones across campus with our smart matching system.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{serviceStats.lostFound.resolved} resolved</span>
                </div>
                <ChevronRight className="h-5 w-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Placements Card */}
          <Link 
            to="/student/placements" 
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500 rounded-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{serviceStats.placements.applied}</p>
                  <p className="text-xs text-green-500 dark:text-green-300">Applied</p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Placements</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Access campus placement opportunities, track applications, and prepare for interviews.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{serviceStats.placements.active} active opportunities</span>
                </div>
                <ChevronRight className="h-5 w-5 text-green-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Complaints Card */}
          <Link 
            to="/student/complaints" 
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-500 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{serviceStats.complaints.pending}</p>
                  <p className="text-xs text-orange-500 dark:text-orange-300">Pending</p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Complaints</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Submit and track complaints with efficient resolution and real-time status updates.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{serviceStats.complaints.resolved} resolved</span>
                </div>
                <ChevronRight className="h-5 w-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Events Card */}
          <Link 
            to="/student/events" 
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500 rounded-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{serviceStats.events.upcoming}</p>
                  <p className="text-xs text-purple-500 dark:text-purple-300">Upcoming</p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Campus Events</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Discover, register, and participate in campus events, workshops, and activities.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-purple-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{serviceStats.events.registered} registered</span>
                </div>
                <ChevronRight className="h-5 w-5 text-purple-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Activity Feed and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
         
          
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link 
                  to="/student/post-lost-item"
                  className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Search className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-3" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Report Lost Item</span>
                </Link>
                <Link 
                  to="/student/complaints/create"
                  className="flex items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <MessageSquare className="h-4 w-4 text-orange-600 dark:text-orange-400 mr-3" />
                  <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Submit Complaint</span>
                </Link>
                <Link 
                  to="/student/events"
                  className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-3" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Browse Events</span>
                </Link>
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-yellow-600 dark:text-yellow-400" />
                Recent Updates
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Lost item found!</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Your reported iPhone was found in Library</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">New placement opportunity</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Software Engineer at TechCorp</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="h-2 w-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Event reminder</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Tech Talk tomorrow at 3 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Resources */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <BookOpen className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
            Campus Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Academic Calendar', icon: Calendar, color: 'blue' },
              { name: 'Campus Map', icon: Map, color: 'green' },
              { name: 'Library Services', icon: Library, color: 'purple' },
              { name: 'Contact Directory', icon: Phone, color: 'orange' }
            ].map((item, index) => (
              <a 
                key={index}
                href="#"
                className={`group bg-${item.color}-50 dark:bg-${item.color}-900/20 p-6 rounded-lg border border-${item.color}-200 dark:border-${item.color}-800 hover:border-${item.color}-400 dark:hover:border-${item.color}-500 transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`p-3 bg-${item.color}-500 rounded-lg mb-3 group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className={`font-semibold text-${item.color}-700 dark:text-${item.color}-300 mb-1`}>{item.name}</h3>
                  <p className={`text-sm text-${item.color}-600 dark:text-${item.color}-400`}>Click to access</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;