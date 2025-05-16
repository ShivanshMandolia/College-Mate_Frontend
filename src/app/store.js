// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from '../features/api/apiSlice';
import authReducer from '../features/auth/authSlice';
import complaintsReducer from '../features/complaints/complaintsSlice';
import eventsReducer from '../features/events/eventsSlice';
import lostFoundReducer from '../features/lostFound/lostFoundSlice';
import placementsReducer from '../features/placements/placementsSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    complaints: complaintsReducer,
    events: eventsReducer,
    lostFound: lostFoundReducer,
    placements: placementsReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: import.meta.env.MODE !== 'production',
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export default store;