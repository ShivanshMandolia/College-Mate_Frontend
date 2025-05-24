import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useLoginMutation } from '../../features/auth/authApiSlice';
import {
  selectIsAuthenticated,
  selectUserRole,
  selectIsSuperAdmin
} from '../../features/auth/authSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});

  const [login, { isLoading }] = useLoginMutation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const isSuperAdmin = useSelector(selectIsSuperAdmin);

  useEffect(() => {
    if (isAuthenticated) {
      if (isSuperAdmin) {
        navigate('/superadmin/dashboard');
      } else if (userRole === 'student') {
        navigate('/student/home');
      } else {
        navigate('/admin/dashboard');
      }
    }
  }, [isAuthenticated, userRole, isSuperAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email or username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await login({
        email: formData.email,
        password: formData.password
      }).unwrap();

      toast.success('Login successful!');
      // User will be redirected by useEffect after isAuthenticated is set
    } catch (err) {
      const errMsg = err?.data?.message || 'Login failed';
      toast.error(errMsg);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)' }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #9333ea, #db2777, #4f46e5)' }}
          >
            <span className="text-2xl font-bold text-white">CM</span>
          </div>
        </div>

        <h2 className="text-center text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300">
          Welcome Back
        </h2>
        <h3 className="text-center text-xl font-semibold text-white mb-2">
          Sign in to College Mate
        </h3>
        <p className="text-center text-slate-300 mb-8">
          Your campus companion for complaints, events, lost and found, and more
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="py-8 px-6 shadow-xl backdrop-blur-lg border border-white/10 rounded-3xl"
             style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="text"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-2xl text-white placeholder-slate-400 transition-all duration-300 focus:outline-none focus:scale-105 ${
                  errors.email ? 'border-2 border-red-400' : 'border border-white/20'
                }`}
                placeholder="Enter your email"
                style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)' }}
              />
              {errors.email && <p className="mt-2 text-sm text-red-400">⚠ {errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-2xl text-white placeholder-slate-400 transition-all duration-300 focus:outline-none focus:scale-105 ${
                  errors.password ? 'border-2 border-red-400' : 'border border-white/20'
                }`}
                placeholder="Enter your password"
                style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)' }}
              />
              {errors.password && <p className="mt-2 text-sm text-red-400">⚠ {errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 rounded border-white/20"
                />
                <span className="ml-2 text-sm text-slate-300">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-sm text-purple-300 hover:text-purple-200">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-2xl text-white font-semibold text-lg transition-all duration-300 focus:outline-none ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'
              }`}
              style={{ background: 'linear-gradient(90deg, #9333ea, #db2777, #4f46e5)' }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-300">
            Don’t have an account?{' '}
            <a href="/register" className="text-purple-300 hover:text-purple-200 font-medium">
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
