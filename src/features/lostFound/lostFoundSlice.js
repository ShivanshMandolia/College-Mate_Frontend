// src/features/lostFound/lostFoundSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  foundItems: [],
  lostItems: [],
  myFoundListings: [],
  myLostListings: [],
  selectedFoundItem: null,
  selectedLostItem: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const lostFoundSlice = createSlice({
  name: 'lostFound',
  initialState,
  reducers: {
    setSelectedFoundItem: (state, action) => {
      state.selectedFoundItem = action.payload;
    },
    clearSelectedFoundItem: (state) => {
      state.selectedFoundItem = null;
    },
    setSelectedLostItem: (state, action) => {
      state.selectedLostItem = action.payload;
    },
    clearSelectedLostItem: (state) => {
      state.selectedLostItem = null;
    },
  },
});

export const {
  setSelectedFoundItem,
  clearSelectedFoundItem,
  setSelectedLostItem,
  clearSelectedLostItem,
} = lostFoundSlice.actions;

// Selectors
export const selectFoundItems = (state) => state.lostFound.foundItems;
export const selectLostItems = (state) => state.lostFound.lostItems;
export const selectMyFoundListings = (state) => state.lostFound.myFoundListings;
export const selectMyLostListings = (state) => state.lostFound.myLostListings;
export const selectSelectedFoundItem = (state) => state.lostFound.selectedFoundItem;
export const selectSelectedLostItem = (state) => state.lostFound.selectedLostItem;


export default lostFoundSlice.reducer;