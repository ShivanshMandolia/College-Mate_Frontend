// src/features/placements/placementsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  placements: [],
  studentPlacements: [],
  registeredStudents: [],
  selectedPlacement: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const placementsSlice = createSlice({
  name: 'placements',
  initialState,
  reducers: {
    setSelectedPlacement: (state, action) => {
      state.selectedPlacement = action.payload;
    },
    clearSelectedPlacement: (state) => {
      state.selectedPlacement = null;
    },
  },
});

export const { setSelectedPlacement, clearSelectedPlacement } = placementsSlice.actions;

// Selectors
export const selectAllPlacements = (state) => state.placements.placements;
export const selectStudentPlacements = (state) => state.placements.studentPlacements;
export const selectRegisteredStudents = (state) => state.placements.registeredStudents;
export const selectSelectedPlacement = (state) => state.placements.selectedPlacement;

export default placementsSlice.reducer;