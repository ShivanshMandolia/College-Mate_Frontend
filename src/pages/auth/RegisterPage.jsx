import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation } from '../../features/auth/authApiSlice';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole, selectIsSuperAdmin } from '../../features/auth/authSlice';
import { toast } from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    secretKey: '',
    avatar: null,
  });
  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const isSuperAdmin = useSelector(selectIsSuperAdmin);

  // If user is already authenticated, redirect to appropriate dashboard
  useEffect(() => {
    if (isAuthenticated) {
      if (isSuperAdmin) {
        navigate('/superadmin/dashboard');
      } else if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    }
  }, [isAuthenticated, userRole, isSuperAdmin, navigate]);

  // Show secret key field when admin role is selected
  useEffect(() => {
    setShowSecretKey(formData.role === 'admin');
    if (formData.role !== 'admin') {
      setFormData(prev => ({ ...prev, secretKey: '' }));
    }
  }, [formData.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatar: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear error if exists
      if (errors.avatar) {
        setErrors(prev => ({
          ...prev,
          avatar: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.avatar) {
      newErrors.avatar = 'Profile picture is required';
    }
    
    if (formData.role === 'admin' && !formData.secretKey.trim()) {
      newErrors.secretKey = 'Secret key is required for admin registration';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const result = await register(formData).unwrap();
      toast.success(result.message || 'Registration successful');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = error.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      
      // Update specific field errors if applicable
      if (error.status === 409) {
        setErrors(prev => ({
          ...prev,
          username: 'Username or email already exists',
          email: 'Username or email already exists'
        }));
      } else if (error.status === 403 && formData.role === 'admin') {
        setErrors(prev => ({
          ...prev,
          secretKey: 'Invalid secret key'
        }));
      }
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)',
      }}
    >
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-10 left-10 w-32 h-32 rounded-full animate-bounce"
          style={{
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.15), transparent)',
            animationDuration: '4s',
            animationDelay: '0s'
          }}
        ></div>
        <div 
          className="absolute top-20 right-20 w-24 h-24 rounded-full animate-bounce"
          style={{
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.2), transparent)',
            animationDuration: '3s',
            animationDelay: '1s'
          }}
        ></div>
        <div 
          className="absolute bottom-40 left-1/3 w-20 h-20 rounded-full animate-bounce"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1), transparent)',
            animationDuration: '3.5s',
            animationDelay: '2s'
          }}
        ></div>
        <div 
          className="absolute bottom-10 right-1/4 w-28 h-28 rounded-full animate-bounce"
          style={{
            background: 'radial-gradient(circle, rgba(219, 39, 119, 0.12), transparent)',
            animationDuration: '4.5s',
            animationDelay: '0.5s'
          }}
        ></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-6">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #9333ea, #db2777, #4f46e5)',
              boxShadow: '0 20px 25px -5px rgba(147, 51, 234, 0.3)'
            }}
          >
            <span className="text-2xl font-bold text-white">CM</span>
          </div>
        </div>

        <h2 
          className="text-center text-3xl font-bold mb-3"
          style={{
            background: 'linear-gradient(90deg, #c084fc, #f472b6, #818cf8)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}
        >
          Join College Mate
        </h2>
        <p className="text-center text-slate-300 mb-8">
          Create your account and connect with your college community
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div 
          className="py-8 px-6 shadow-xl transition-all duration-500"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px'
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div className="mb-4">
                {avatarPreview ? (
                  <div className="relative group">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-24 w-24 rounded-full object-cover border-4 border-white/20 shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarPreview(null);
                        setFormData(prev => ({ ...prev, avatar: null }));
                      }}
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow-lg hover:bg-red-600 transition-colors duration-200"
                      aria-label="Remove avatar"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div 
                    className="h-24 w-24 rounded-full flex items-center justify-center border-4 border-white/20 shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(79, 70, 229, 0.3))'
                    }}
                  >
                    <svg className="h-12 w-12 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.35 0-10 1.68-10 5v3h20v-3c0-3.32-6.65-5-10-5z" />
                    </svg>
                  </div>
                )}
              </div>
              <label 
                htmlFor="avatar" 
                className="px-6 py-2 rounded-xl text-white font-medium cursor-pointer transition-all duration-300 hover:scale-105 focus:outline-none focus:scale-105"
                style={{
                  background: 'linear-gradient(90deg, #8b5cf6, #a855f7)',
                  boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.3)'
                }}
              >
                Upload Profile Picture
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {errors.avatar && (
                <p className="mt-2 text-sm text-red-400 flex items-center">
                  <span className="mr-2">⚠</span>
                  {errors.avatar}
                </p>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-3 rounded-2xl text-white placeholder-slate-400 
                    transition-all duration-300 focus:outline-none focus:scale-105
                    ${errors.fullName ? 'border-2 border-red-400' : 'border border-white/20'}
                  `}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <span className="mr-2">⚠</span>
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-3 rounded-2xl text-white placeholder-slate-400 
                    transition-all duration-300 focus:outline-none focus:scale-105
                    ${errors.email ? 'border-2 border-red-400' : 'border border-white/20'}
                  `}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <span className="mr-2">⚠</span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-3 rounded-2xl text-white placeholder-slate-400 
                    transition-all duration-300 focus:outline-none focus:scale-105
                    ${errors.username ? 'border-2 border-red-400' : 'border border-white/20'}
                  `}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                  placeholder="Choose a username"
                />
                {errors.username && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <span className="mr-2">⚠</span>
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-3 rounded-2xl text-white placeholder-slate-400 
                    transition-all duration-300 focus:outline-none focus:scale-105
                    ${errors.password ? 'border-2 border-red-400' : 'border border-white/20'}
                  `}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                  placeholder="Create a password"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <span className="mr-2">⚠</span>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-3 rounded-2xl text-white placeholder-slate-400 
                    transition-all duration-300 focus:outline-none focus:scale-105
                    ${errors.confirmPassword ? 'border-2 border-red-400' : 'border border-white/20'}
                  `}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <span className="mr-2">⚠</span>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-2">
                  Select Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl text-white border border-white/20 transition-all duration-300 focus:outline-none focus:scale-105"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <option value="student" style={{ background: '#0f172a', color: 'white' }}>Student</option>
                  <option value="admin" style={{ background: '#0f172a', color: 'white' }}>Administrator</option>
                </select>
              </div>

              {/* Secret Key (Only visible for admin registration) */}
              {showSecretKey && (
                <div>
                  <label htmlFor="secretKey" className="block text-sm font-medium text-slate-300 mb-2">
                    Admin Secret Key
                  </label>
                  <input
                    id="secretKey"
                    name="secretKey"
                    type="password"
                    value={formData.secretKey}
                    onChange={handleChange}
                    className={`
                      w-full px-4 py-3 rounded-2xl text-white placeholder-slate-400 
                      transition-all duration-300 focus:outline-none focus:scale-105
                      ${errors.secretKey ? 'border-2 border-red-400' : 'border border-white/20'}
                    `}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(8px)',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                    placeholder="Enter admin secret key"
                  />
                  {errors.secretKey && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <span className="mr-2">⚠</span>
                      {errors.secretKey}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-slate-400">
                    Secret key is required for admin registration. To be registered as a super admin, use the super admin secret key.
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  w-full py-3 px-4 rounded-2xl text-white font-semibold text-lg
                  transition-all duration-300 focus:outline-none focus:scale-105
                  ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'}
                `}
                style={{
                  background: 'linear-gradient(90deg, #9333ea, #db2777, #4f46e5)',
                  boxShadow: '0 20px 25px -5px rgba(147, 51, 234, 0.3)'
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span 
                  className="px-4 text-slate-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px'
                  }}
                >
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-3 px-4 rounded-2xl text-purple-400 font-semibold border border-purple-400/50 hover:bg-purple-400/10 transition-all duration-300 hover:scale-105 focus:outline-none focus:scale-105"
                style={{
                  background: 'rgba(147, 51, 234, 0.1)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;