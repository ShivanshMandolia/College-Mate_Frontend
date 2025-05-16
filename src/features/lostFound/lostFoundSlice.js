// src/features/lostFound/lostFoundSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  foundItems: [],
  lostRequests: [],
  myListings: [],
  myRequests: [],
  selectedItem: null,
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
  },
});

export const { setSelectedItem, clearSelectedItem } = lostFoundSlice.actions;

// Selectors
export const selectFoundItems = (state) => state.lostFound.foundItems;
export const selectLostRequests = (state) => state.lostFound.lostRequests;
export const selectMyListings = (state) => state.lostFound.myListings;
export const selectMyRequests = (state) => state.lostFound.myRequests;
export const selectSelectedItem = (state) => state.lostFound.selectedItem;

export default lostFoundSlice.reducer;