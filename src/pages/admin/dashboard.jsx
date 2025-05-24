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
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)',
      }}
    >
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-32 h-32 rounded-full animate-pulse"
          style={{ background: 'rgba(147, 51, 234, 0.1)' }}
        ></div>
        <div 
          className="absolute bottom-40 right-20 w-48 h-48 rounded-full animate-pulse"
          style={{ background: 'rgba(79, 70, 229, 0.1)' }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full animate-pulse"
          style={{ background: 'rgba(59, 130, 246, 0.05)' }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center">
            <div 
              className="p-3 rounded-2xl mr-4 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #9333ea, #db2777)',
                boxShadow: '0 20px 25px -5px rgba(147, 51, 234, 0.3)'
              }}
            >
              <ShieldCheck className="h-8 w-8 text-white" />
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
                {getGreeting()}, {user?.name || 'Admin'}
              </h1>
              <p className="text-slate-300 text-lg">Welcome to your admin dashboard</p>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 flex items-center space-x-4">
            <button 
              className="relative p-3 rounded-2xl text-white transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Bell className="h-6 w-6" />
              {notifications > 0 && (
                <span 
                  className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white rounded-full transform"
                  style={{ background: 'linear-gradient(90deg, #db2777, #9333ea)' }}
                >
                  {notifications}
                </span>
              )}
            </button>
            
            <button 
              className="p-3 rounded-2xl text-white transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Calendar className="h-6 w-6" />
            </button>
            
            <button 
              className="p-3 rounded-2xl text-white transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Settings className="h-6 w-6" />
            </button>
            
            <div 
              className="rounded-2xl h-12 w-12 flex items-center justify-center font-bold text-white text-lg shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #9333ea, #4f46e5)',
                boxShadow: '0 10px 25px -5px rgba(147, 51, 234, 0.4)'
              }}
            >
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <Link 
            to="/admin/complaints" 
            className="group transition-all duration-500 hover:-translate-y-2"
          >
            <div 
              className="rounded-3xl p-8 transition-all duration-500 group-hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.border = '1px solid rgba(147, 51, 234, 0.5)';
                e.target.style.boxShadow = '0 25px 50px -12px rgba(147, 51, 234, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-300 text-sm font-medium mb-2">Assigned Complaints</p>
                  <h3 className="text-4xl font-bold text-white mb-3">24</h3>
                  <div className="flex items-center">
                    <span className="text-green-400 text-sm font-semibold">+5%</span>
                    <span className="text-slate-400 text-sm ml-2">from last week</span>
                  </div>
                </div>
                <div 
                  className="p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    background: 'linear-gradient(135deg, #9333ea, #4f46e5)',
                    boxShadow: '0 10px 25px -5px rgba(147, 51, 234, 0.4)'
                  }}
                >
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </Link>

          <Link 
            to="/admin/events" 
            className="group transition-all duration-500 hover:-translate-y-2"
          >
            <div 
              className="rounded-3xl p-8 transition-all duration-500 group-hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.border = '1px solid rgba(251, 146, 60, 0.5)';
                e.target.style.boxShadow = '0 25px 50px -12px rgba(251, 146, 60, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-300 text-sm font-medium mb-2">Events</p>
                  <h3 className="text-4xl font-bold text-white mb-3">12</h3>
                  <div className="flex items-center">
                    <span className="text-green-400 text-sm font-semibold">+10%</span>
                    <span className="text-slate-400 text-sm ml-2">from last month</span>
                  </div>
                </div>
                <div 
                  className="p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    background: 'linear-gradient(135deg, #fb923c, #facc15)',
                    boxShadow: '0 10px 25px -5px rgba(251, 146, 60, 0.4)'
                  }}
                >
                  <Megaphone className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </Link>

          <Link 
            to="/admin/placements" 
            className="group transition-all duration-500 hover:-translate-y-2"
          >
            <div 
              className="rounded-3xl p-8 transition-all duration-500 group-hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.border = '1px solid rgba(139, 92, 246, 0.5)';
                e.target.style.boxShadow = '0 25px 50px -12px rgba(139, 92, 246, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-300 text-sm font-medium mb-2">Placements</p>
                  <h3 className="text-4xl font-bold text-white mb-3">30</h3>
                  <div className="flex items-center">
                    <span className="text-green-400 text-sm font-semibold">+7%</span>
                    <span className="text-slate-400 text-sm ml-2">from last week</span>
                  </div>
                </div>
                <div 
                  className="p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                    boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.4)'
                  }}
                >
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          <div 
            className="rounded-2xl p-6 text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="text-2xl font-bold text-white mb-1">89%</div>
            <div className="text-slate-300 text-sm">Resolution Rate</div>
          </div>
          
          <div 
            className="rounded-2xl p-6 text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="text-2xl font-bold text-white mb-1">2.4h</div>
            <div className="text-slate-300 text-sm">Avg Response</div>
          </div>
          
          <div 
            className="rounded-2xl p-6 text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="text-2xl font-bold text-white mb-1">156</div>
            <div className="text-slate-300 text-sm">Active Students</div>
          </div>
          
          <div 
            className="rounded-2xl p-6 text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="text-2xl font-bold text-white mb-1">98%</div>
            <div className="text-slate-300 text-sm">Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;