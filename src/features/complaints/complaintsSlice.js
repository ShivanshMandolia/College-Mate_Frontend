// src/features/complaints/complaintsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  complaints: [],
  selectedComplaint: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
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
  },
});

export const { setSelectedComplaint, clearSelectedComplaint } = complaintsSlice.actions;

// Selectors
export const selectAllComplaints = (state) => state.complaints.complaints;
export const selectSelectedComplaint = (state) => state.complaints.selectedComplaint;

export default complaintsSlice.reducer;