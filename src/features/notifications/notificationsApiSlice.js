// src/features/notifications/notificationsApiSlice.js
import { apiSlice } from '../api/apiSlice';
import { setUnreadCount } from './notificationsSlice';

export const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getComplaintNotifications: builder.query({
      query: () => '/notifications',
      providesTags: ['Notifications'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Calculate unread notifications
          if (data && data.data) {
            const unreadCount = data.data.filter(notification => !notification.read).length;
            dispatch(setUnreadCount(unreadCount));
          }
        } catch (err) {
          // Handle error if needed
        }
      },
    }),
    
    getLostFoundNotifications: builder.query({
      query: () => '/notifications',
      providesTags: ['Notifications'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Calculate unread notifications
          if (data && data.data) {
            const unreadCount = data.data.filter(notification => !notification.read).length;
            dispatch(setUnreadCount(unreadCount));
          }
        } catch (err) {
          // Handle error if needed
        }
      },
    }),
    
    markNotificationAsRead: builder.mutation({
      query: (notificationId) => ({
        url: '/mark-notification-read',
        method: 'POST',
        body: { notificationId },
      }),
      invalidatesTags: ['Notifications'],
    }),
    
    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: '/mark-all-notifications-read',
        method: 'POST',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetComplaintNotificationsQuery,
  useGetLostFoundNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = notificationsApiSlice;