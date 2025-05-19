// src/features/complaints/complaintsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  complaints: [],
  selectedComplaint: null,
  notifications: [],
  adminStatuses: [],
  searchResults: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  searchStatus: 'idle',
  notificationStatus: 'idle',
  adminStatusLoading: false,
};

const complaintsSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    setSelectedComplaint: (state, action) => {
      state.selectedComplaint = action.payload;
    },
    clearSelectedComplaint: (state) => {
      state.selectedComplaint = null;
    },
    setComplaints: (state, action) => {
      state.complaints = action.payload;
      state.status = 'succeeded';
    },
    addComplaint: (state, action) => {
      state.complaints.unshift(action.payload);
    },
    updateComplaint: (state, action) => {
      const index = state.complaints.findIndex(
        complaint => complaint._id === action.payload._id
      );
      if (index !== -1) {
        state.complaints[index] = action.payload;
      }
      // Also update selected complaint if it matches
      if (state.selectedComplaint?._id === action.payload._id) {
        state.selectedComplaint = action.payload;
      }
    },
    removeComplaint: (state, action) => {
      state.complaints = state.complaints.filter(
        complaint => complaint._id !== action.payload
      );
      // Clear selected complaint if it was deleted
      if (state.selectedComplaint?._id === action.payload) {
        state.selectedComplaint = null;
      }
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.notificationStatus = 'succeeded';
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(
        notif => notif._id === action.payload
      );
      if (notification) {
        notification.isRead = true;
      }
    },
    setAdminStatuses: (state, action) => {
      state.adminStatuses = action.payload;
      state.adminStatusLoading = false;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
      state.searchStatus = 'succeeded';
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchStatus = 'idle';
    },
    setLoading: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.status = 'failed';
    },
    clearError: (state) => {
      state.error = null;
    },
    setSearchLoading: (state, action) => {
      state.searchStatus = action.payload;
    },
    setNotificationLoading: (state, action) => {
      state.notificationStatus = action.payload;
    },
    setAdminStatusLoading: (state, action) => {
      state.adminStatusLoading = action.payload;
    },
  },
});

export const {
  setSelectedComplaint,
  clearSelectedComplaint,
  setComplaints,
  addComplaint,
  updateComplaint,
  removeComplaint,
  setNotifications,
  addNotification,
  markNotificationAsRead,
  setAdminStatuses,
  setSearchResults,
  clearSearchResults,
  setLoading,
  setError,
  clearError,
  setSearchLoading,
  setNotificationLoading,
  setAdminStatusLoading,
} = complaintsSlice.actions;

// Selectors
export const selectAllComplaints = (state) => state.complaints.complaints;
export const selectSelectedComplaint = (state) => state.complaints.selectedComplaint;
export const selectComplaintsStatus = (state) => state.complaints.status;
export const selectComplaintsError = (state) => state.complaints.error;
export const selectNotifications = (state) => state.complaints.notifications;
export const selectNotificationStatus = (state) => state.complaints.notificationStatus;
export const selectAdminStatuses = (state) => state.complaints.adminStatuses;
export const selectAdminStatusLoading = (state) => state.complaints.adminStatusLoading;
export const selectSearchResults = (state) => state.complaints.searchResults;
export const selectSearchStatus = (state) => state.complaints.searchStatus;
export const selectUnreadNotifications = (state) => 
  state.complaints.notifications.filter(notification => !notification.isRead);

// Utility selectors
export const selectComplaintById = (state, complaintId) =>
  state.complaints.complaints.find(complaint => complaint._id === complaintId);

export const selectComplaintsByStatus = (state, status) =>
  state.complaints.complaints.filter(complaint => complaint.status === status);

export const selectMyComplaints = (state, userId) =>
  state.complaints.complaints.filter(complaint => complaint.createdBy === userId);

export default complaintsSlice.reducer;