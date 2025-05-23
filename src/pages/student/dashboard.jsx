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
  Star,
  Sparkles,
  Zap
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
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)'
    }}>
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full opacity-20 animate-pulse" style={{
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3), transparent)'
        }}></div>
        <div className="absolute top-40 right-32 w-24 h-24 rounded-full opacity-15 animate-pulse delay-1000" style={{
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.3), transparent)'
        }}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 rounded-full opacity-10 animate-pulse delay-2000" style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2), transparent)'
        }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{
              background: 'linear-gradient(90deg, #c084fc, #f472b6, #818cf8)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}>
              {getGreeting()}, {user?.name || 'Student'}! 
              <span className="ml-2">✨</span>
            </h1>
            <p className="text-xl text-slate-300 font-medium">
              Your personalized campus dashboard
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex items-center space-x-4">
            <div className="flex items-center space-x-3 px-6 py-3 rounded-2xl backdrop-blur-lg border transition-all duration-300 hover:scale-105" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.10)',
              backdropFilter: 'blur(10px)'
            }}>
              <Clock className="h-5 w-5" style={{ color: '#c084fc' }} />
              <span className="text-sm font-semibold text-white">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <button className="relative p-4 rounded-2xl backdrop-blur-lg border transition-all duration-300 hover:scale-110 hover:rotate-3" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.10)',
              backdropFilter: 'blur(10px)'
            }}>
              <Bell className="h-6 w-6 text-white" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white rounded-full animate-pulse" style={{
                  background: 'linear-gradient(90deg, #9333ea, #db2777)'
                }}>
                  {notifications}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Lost & Found Items',
              value: serviceStats.lostFound.total,
              subtitle: `${serviceStats.lostFound.recent} new today`,
              icon: Search,
              gradient: 'linear-gradient(135deg, #6366f1, #2563eb)',
              color: '#818cf8'
            },
            {
              title: 'Active Placements',
              value: serviceStats.placements.active,
              subtitle: `${serviceStats.placements.upcoming} upcoming`,
              icon: Briefcase,
              gradient: 'linear-gradient(135deg, #3b82f6, #0891b2)',
              color: '#60a5fa'
            },
            {
              title: 'My Complaints',
              value: serviceStats.complaints.total,
              subtitle: `${serviceStats.complaints.pending} pending`,
              icon: MessageSquare,
              gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
              color: '#c084fc'
            },
            {
              title: 'Campus Events',
              value: serviceStats.events.total,
              subtitle: `${serviceStats.events.upcoming} upcoming`,
              icon: Calendar,
              gradient: 'linear-gradient(135deg, #a855f7, #4f46e5)',
              color: '#f472b6'
            }
          ].map((stat, index) => (
            <div 
              key={index}
              className="p-6 rounded-3xl backdrop-blur-lg border transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.10)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl" style={{ background: stat.gradient }}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <Sparkles className="h-6 w-6 opacity-30" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-slate-300 text-sm font-medium mb-2">{stat.title}</p>
                <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-xs font-medium" style={{ color: stat.color }}>{stat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Service Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {/* Lost & Found Card */}
          <Link 
            to="/student/lost-found" 
            className="group block p-8 rounded-3xl backdrop-blur-lg border transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.10)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(37, 99, 235, 0.1))'
            }}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" style={{
                  background: 'linear-gradient(135deg, #6366f1, #2563eb)'
                }}>
                  <Search className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold" style={{ color: '#818cf8' }}>{serviceStats.lostFound.recent}</p>
                  <p className="text-xs font-medium text-slate-300">New Items</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Lost & Found</h3>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Find lost items or report found ones across campus with our smart matching system.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" style={{ color: '#3b82f6' }} />
                  <span className="text-xs text-slate-400 font-medium">{serviceStats.lostFound.resolved} resolved</span>
                </div>
                <ChevronRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" style={{ color: '#818cf8' }} />
              </div>
            </div>
          </Link>

          {/* Placements Card */}
          <Link 
            to="/student/placements" 
            className="group block p-8 rounded-3xl backdrop-blur-lg border transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.10)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(8, 145, 178, 0.1))'
            }}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" style={{
                  background: 'linear-gradient(135deg, #3b82f6, #0891b2)'
                }}>
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold" style={{ color: '#60a5fa' }}>{serviceStats.placements.applied}</p>
                  <p className="text-xs font-medium text-slate-300">Applied</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Placements</h3>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Access campus placement opportunities, track applications, and prepare for interviews.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" style={{ color: '#3b82f6' }} />
                  <span className="text-xs text-slate-400 font-medium">{serviceStats.placements.active} active opportunities</span>
                </div>
                <ChevronRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" style={{ color: '#60a5fa' }} />
              </div>
            </div>
          </Link>

          {/* Complaints Card */}
          <Link 
            to="/student/complaints" 
            className="group block p-8 rounded-3xl backdrop-blur-lg border transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.10)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1))'
            }}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #a855f7)'
                }}>
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold" style={{ color: '#c084fc' }}>{serviceStats.complaints.pending}</p>
                  <p className="text-xs font-medium text-slate-300">Pending</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Complaints</h3>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Submit and track complaints with efficient resolution and real-time status updates.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5" style={{ color: '#8b5cf6' }} />
                  <span className="text-xs text-slate-400 font-medium">{serviceStats.complaints.resolved} resolved</span>
                </div>
                <ChevronRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" style={{ color: '#c084fc' }} />
              </div>
            </div>
          </Link>

          {/* Events Card */}
          <Link 
            to="/student/events" 
            className="group block p-8 rounded-3xl backdrop-blur-lg border transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.10)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(79, 70, 229, 0.1))'
            }}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" style={{
                  background: 'linear-gradient(135deg, #a855f7, #4f46e5)'
                }}>
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold" style={{ color: '#f472b6' }}>{serviceStats.events.upcoming}</p>
                  <p className="text-xs font-medium text-slate-300">Upcoming</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Campus Events</h3>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Discover, register, and participate in campus events, workshops, and activities.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5" style={{ color: '#a855f7' }} />
                  <span className="text-xs text-slate-400 font-medium">{serviceStats.events.registered} registered</span>
                </div>
                <ChevronRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" style={{ color: '#f472b6' }} />
              </div>
            </div>
          </Link>
        </div>

        {/* Activity Feed and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="p-8 rounded-3xl backdrop-blur-lg border" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.10)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-2xl font-bold mb-6 flex items-center text-white">
                <Zap className="h-6 w-6 mr-3" style={{ color: '#c084fc' }} />
                Recent Activity
              </h3>
              <ActivityFeed />
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="p-6 rounded-3xl backdrop-blur-lg border" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.10)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-xl font-bold mb-6 flex items-center text-white">
                <Award className="h-6 w-6 mr-3" style={{ color: '#818cf8' }} />
                Quick Actions
              </h3>
              <div className="space-y-4">
                {[
                  { to: "/student/post-lost-item", icon: Search, text: "Report Lost Item", color: '#6366f1' },
                  { to: "/student/complaints/create", icon: MessageSquare, text: "Submit Complaint", color: '#8b5cf6' },
                  { to: "/student/events", icon: Calendar, text: "Browse Events", color: '#a855f7' }
                ].map((action, index) => (
                  <Link 
                    key={index}
                    to={action.to}
                    className="flex items-center p-4 rounded-2xl backdrop-blur-lg border transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.10)'
                    }}
                  >
                    <div className="p-2 rounded-xl mr-4" style={{ backgroundColor: action.color + '20' }}>
                      <action.icon className="h-5 w-5" style={{ color: action.color }} />
                    </div>
                    <span className="text-sm font-semibold text-white">{action.text}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="p-6 rounded-3xl backdrop-blur-lg border" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.10)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-xl font-bold mb-6 flex items-center text-white">
                <Bell className="h-6 w-6 mr-3" style={{ color: '#facc15' }} />
                Recent Updates
              </h3>
              <div className="space-y-4">
                {[
                  { color: '#3b82f6', title: 'Lost item found!', desc: 'Your reported iPhone was found in Library' },
                  { color: '#6366f1', title: 'New placement opportunity', desc: 'Software Engineer at TechCorp' },
                  { color: '#a855f7', title: 'Event reminder', desc: 'Tech Talk tomorrow at 3 PM' }
                ].map((notification, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-2xl backdrop-blur-lg border" style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderColor: 'rgba(255, 255, 255, 0.05)'
                  }}>
                    <div className="h-3 w-3 rounded-full mt-2" style={{ backgroundColor: notification.color }}></div>
                    <div>
                      <p className="text-sm font-semibold text-white mb-1">{notification.title}</p>
                      <p className="text-xs text-slate-400">{notification.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Resources */}
        <div className="p-8 rounded-3xl backdrop-blur-lg border" style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderColor: 'rgba(255, 255, 255, 0.10)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 className="text-2xl font-bold mb-8 flex items-center text-white">
            <BookOpen className="h-6 w-6 mr-3" style={{ color: '#60a5fa' }} />
            Campus Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Academic Calendar', icon: Calendar, gradient: 'linear-gradient(135deg, #6366f1, #2563eb)' },
              { name: 'Campus Map', icon: Map, gradient: 'linear-gradient(135deg, #3b82f6, #0891b2)' },
              { name: 'Library Services', icon: Library, gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)' },
              { name: 'Contact Directory', icon: Phone, gradient: 'linear-gradient(135deg, #a855f7, #4f46e5)' }
            ].map((item, index) => (
              <a 
                key={index}
                href="#"
                className="group p-8 rounded-2xl backdrop-blur-lg border transition-all duration-500 hover:scale-105 hover:-translate-y-2 text-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.10)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="p-4 rounded-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" style={{
                    background: item.gradient
                  }}>
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-2 text-lg">{item.name}</h3>
                  <p className="text-sm text-slate-400">Click to access</p>
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