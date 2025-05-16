// src/features/events/eventsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [],
  selectedEvent: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    },
  },
});

export const { setSelectedEvent, clearSelectedEvent } = eventsSlice.actions;

// Selectors
export const selectAllEvents = (state) => state.events.events;
export const selectSelectedEvent = (state) => state.events.selectedEvent;

export default eventsSlice.reducer;