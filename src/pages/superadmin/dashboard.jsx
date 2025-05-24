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
  Filter,
  Users,
  TrendingUp,
  Activity
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

  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400/20 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-indigo-400/20 rounded-full animate-pulse delay-300"></div>
      <div className="absolute bottom-40 left-1/4 w-1 h-1 bg-pink-400/20 rounded-full animate-pulse delay-700"></div>
      <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-cyan-400/20 rounded-full animate-pulse delay-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen relative" style={{
      background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)'
    }}>
      <FloatingParticles />
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="relative">
            <div className="flex items-center">
              <div className="relative">
                <div 
                  className="h-12 w-12 rounded-2xl flex items-center justify-center mr-4 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #9333ea, #db2777)',
                    boxShadow: '0 10px 25px -5px rgba(147, 51, 234, 0.3)'
                  }}
                >
                  <ShieldCheck className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h1 
                  className="text-3xl md:text-4xl font-bold mb-1"
                  style={{
                    background: 'linear-gradient(90deg, #c084fc, #f472b6, #818cf8)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  {getGreeting()}, {user?.name || 'Administrator'}
                </h1>
                <p className="text-slate-300 text-lg font-medium">
                  Super Administrator Dashboard
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 flex items-center space-x-4">
            <button 
              className="relative p-3 rounded-2xl transition-all duration-300 hover:scale-110"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.10)'
              }}
            >
              <Bell className="h-6 w-6 text-slate-300" />
              {notifications > 0 && (
                <span 
                  className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #db2777, #9333ea)'
                  }}
                >
                  {notifications}
                </span>
              )}
            </button>
            
            <button 
              className="p-3 rounded-2xl transition-all duration-300 hover:scale-110"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.10)'
              }}
            >
              <Calendar className="h-6 w-6 text-slate-300" />
            </button>
            
            <button 
              className="p-3 rounded-2xl transition-all duration-300 hover:scale-110"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.10)'
              }}
            >
              <Settings className="h-6 w-6 text-slate-300" />
            </button>
            
            <div 
              className="h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-white text-lg shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
                boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.3)'
              }}
            >
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Link 
            to="/superadmin/complaints" 
            className="group relative overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
              e.currentTarget.style.border = '1px solid rgba(147, 51, 234, 0.50)';
              e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(147, 51, 234, 0.20)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.10)';
              e.currentTarget.style.boxShadow = '0 10px 40px -10px rgba(0, 0, 0, 0.3)';
            }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-slate-300 text-sm font-medium mb-2">Total Complaints</p>
                <h3 className="text-4xl font-bold text-white mb-3">51</h3>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  <p className="text-green-400 text-sm font-medium">
                    +12% from last month
                  </p>
                </div>
              </div>
              <div 
                className="p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{
                  background: 'linear-gradient(135deg, #9333ea, #db2777)',
                  boxShadow: '0 10px 25px -5px rgba(147, 51, 234, 0.3)'
                }}
              >
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
            </div>
            
            {/* Hover glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div 
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(219, 39, 119, 0.05))'
                }}
              ></div>
            </div>
          </Link>
          
          <Link 
            to="/superadmin/placements" 
            className="group relative overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
              e.currentTarget.style.border = '1px solid rgba(79, 70, 229, 0.50)';
              e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(79, 70, 229, 0.20)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.10)';
              e.currentTarget.style.boxShadow = '0 10px 40px -10px rgba(0, 0, 0, 0.3)';
            }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-slate-300 text-sm font-medium mb-2">Active Placements</p>
                <h3 className="text-4xl font-bold text-white mb-3">28</h3>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  <p className="text-green-400 text-sm font-medium">
                    +8% from last week
                  </p>
                </div>
              </div>
              <div 
                className="p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5, #3b82f6)',
                  boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.3)'
                }}
              >
                <Briefcase className="h-8 w-8 text-white" />
              </div>
            </div>
            
            {/* Hover glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div 
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(59, 130, 246, 0.05))'
                }}
              ></div>
            </div>
          </Link>

          {/* Additional stats card for better layout */}
          <div 
            className="group relative overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
              e.currentTarget.style.border = '1px solid rgba(139, 92, 246, 0.50)';
              e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(139, 92, 246, 0.20)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.10)';
              e.currentTarget.style.boxShadow = '0 10px 40px -10px rgba(0, 0, 0, 0.3)';
            }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-slate-300 text-sm font-medium mb-2">System Health</p>
                <h3 className="text-4xl font-bold text-white mb-3">98%</h3>
                <div className="flex items-center">
                  <Activity className="h-4 w-4 text-green-400 mr-1" />
                  <p className="text-green-400 text-sm font-medium">
                    All systems operational
                  </p>
                </div>
              </div>
              <div 
                className="p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #0891b2)',
                  boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.3)'
                }}
              >
                <Activity className="h-8 w-8 text-white" />
              </div>
            </div>
            
            {/* Hover glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div 
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(8, 145, 178, 0.05))'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: MessageSquare, label: 'View Complaints', color: 'from-purple-600 to-pink-600' },
              { icon: Briefcase, label: 'Manage Placements', color: 'from-indigo-600 to-blue-600' },
              { icon: Users, label: 'User Management', color: 'from-violet-500 to-purple-600' },
              { icon: Megaphone, label: 'Announcements', color: 'from-blue-500 to-cyan-600' }
            ].map((action, index) => (
              <button
                key={index}
                className="group p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.10)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.20)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.10)';
                }}
              >
                <div 
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
                  style={{
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-slate-300 text-sm font-medium text-center">{action.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;