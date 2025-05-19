// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,           // user object includes role, isSuperAdmin, etc.
  accessToken: null,
  isAuthenticated: false,
  status: 'idle',       // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
    },
    logOut: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

// Role-based selectors
export const selectUserRole = (state) => state.auth.user?.role;
// True only if user is superadmin
export const selectIsSuperAdmin = (state) =>
  state.auth.user?.role === 'admin' && state.auth.user?.isSuperAdmin === true;

// True only if user is normal admin (not superadmin)
export const selectIsAdmin = (state) =>
  state.auth.user?.role === 'admin' && state.auth.user?.isSuperAdmin !== true;

export default authSlice.reducer;
