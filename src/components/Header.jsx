import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  GraduationCap, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  Sparkles
} from 'lucide-react';
import { selectIsAuthenticated, selectUserRole, selectIsSuperAdmin, selectCurrentUser } from '../features/auth/authSlice';
import { useLogoutMutation } from '../features/auth/authApiSlice';

// Header Component
export const Header = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const isSuperAdmin = useSelector(selectIsSuperAdmin);
  const currentUser = useSelector(selectCurrentUser);
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Simulate scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Dynamic text colors based on scroll state
  const textColor = isScrolled ? 'text-white' : 'text-slate-800';
  const buttonBorderColor = isScrolled ? 'border-white/20' : 'border-slate-300';
  const buttonBgColor = isScrolled ? 'bg-white/10' : 'bg-white/80';
  const userWelcomeBg = isScrolled ? 'bg-white/5' : 'bg-slate-100/80';
  const menuButtonColor = isScrolled ? 'text-white' : 'text-slate-800';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-purple-500/10' 
        : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900  overflow-hidden transition-all duration-500'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-110">
                <GraduationCap className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-2 h-2 text-yellow-800" />
              </div>
            </div>
            <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              College Mate
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* User Welcome */}
                <div className={`flex items-center space-x-3 px-4 py-2 ${userWelcomeBg} backdrop-blur-sm rounded-xl border ${buttonBorderColor}`}>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className={`${textColor} font-medium`}>
                    Welcome, {currentUser?.fullName || 'User'}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Login Button */}
                <Link
                  to="/login"
                  className={`px-6 py-3 ${buttonBgColor} backdrop-blur-sm ${textColor} font-semibold rounded-xl border ${buttonBorderColor} hover:bg-white/30 hover:border-slate-400 transition-all duration-300 transform hover:scale-105`}
                >
                  Login
                </Link>
                
                {/* Register Button */}
                <Link
                  to="/register"
                  className="group px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
                >
                  <span className="relative z-10">Register</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 ${buttonBgColor} backdrop-blur-sm rounded-lg border ${buttonBorderColor} ${menuButtonColor} hover:bg-white/30 transition-all duration-300`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-6 space-y-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-medium">
                      {currentUser?.fullName || 'User'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block w-full p-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full p-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-semibold rounded-xl text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;