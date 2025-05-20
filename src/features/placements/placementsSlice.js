import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  placements: [],
  studentPlacements: [],
  registeredStudents: [],
  selectedPlacement: null,
  admins: [],  // State for storing admins list
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
    // Add a reducer to set all placements
    setPlacements: (state, action) => {
      state.placements = action.payload;
    },
    // Reducer for setting admins
    setAdmins: (state, action) => {
      state.admins = action.payload;
    },
    // Reducer for setting assigned admin to a placement
    setPlacementAdmin: (state, action) => {
      const { placementId, adminId } = action.payload;
      
      // Update in placements array
      const placement = state.placements.find(p => p._id === placementId);
      if (placement) {
        placement.assignedAdmin = adminId;
      }
      
      // Update in selectedPlacement if it's the current one
      if (state.selectedPlacement && state.selectedPlacement._id === placementId) {
        state.selectedPlacement.assignedAdmin = adminId;
      }
    },
  },
});

export const { 
  setSelectedPlacement,
  clearSelectedPlacement,
  setPlacements, // Export the new action
  setAdmins,
  setPlacementAdmin 
} = placementsSlice.actions;

// Selectors
export const selectAllPlacements = (state) => state.placements.placements;
export const selectStudentPlacements = (state) => state.placements.studentPlacements;
export const selectRegisteredStudents = (state) => state.placements.registeredStudents;
export const selectSelectedPlacement = (state) => state.placements.selectedPlacement;
export const selectAllAdmins = (state) => state.placements.admins;

export default placementsSlice.reducer;