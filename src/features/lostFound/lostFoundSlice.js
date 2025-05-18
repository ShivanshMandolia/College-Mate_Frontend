// src/features/lostFound/lostFoundSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  foundItems: [],
  lostRequests: [],
  myListings: [],
  myRequests: [],
  myLostRequests: [],
  selectedItem: null,
  selectedLostRequest: null,
  selectedClaim: null,
  claims: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const lostFoundSlice = createSlice({
  name: 'lostFound',
  initialState,
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },
    setSelectedLostRequest: (state, action) => {
      state.selectedLostRequest = action.payload;
    },
    clearSelectedLostRequest: (state) => {
      state.selectedLostRequest = null;
    },
    setSelectedClaim: (state, action) => {
      state.selectedClaim = action.payload;
    },
    clearSelectedClaim: (state) => {
      state.selectedClaim = null;
    },
    setClaims: (state, action) => {
      state.claims = action.payload;
    },
    clearClaims: (state) => {
      state.claims = [];
    },
  },
});

export const { 
  setSelectedItem, 
  clearSelectedItem,
  setSelectedLostRequest,
  clearSelectedLostRequest,
  setSelectedClaim,
  clearSelectedClaim,
  setClaims,
  clearClaims,
} = lostFoundSlice.actions;

// Selectors
export const selectFoundItems = (state) => state.lostFound.foundItems;
export const selectLostRequests = (state) => state.lostFound.lostRequests;
export const selectMyListings = (state) => state.lostFound.myListings;
export const selectMyRequests = (state) => state.lostFound.myRequests;
export const selectMyLostRequests = (state) => state.lostFound.myLostRequests;
export const selectSelectedItem = (state) => state.lostFound.selectedItem;
export const selectSelectedLostRequest = (state) => state.lostFound.selectedLostRequest;
export const selectSelectedClaim = (state) => state.lostFound.selectedClaim;
export const selectClaims = (state) => state.lostFound.claims;

export default lostFoundSlice.reducer;