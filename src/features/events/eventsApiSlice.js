// src/features/events/eventsApiSlice.js
import { apiSlice } from '../api/apiSlice';

export const eventsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createEvent: builder.mutation({
      query: (eventData) => {
        const formData = new FormData();
        
        // Add text data
        Object.keys(eventData).forEach(key => {
          if (key !== 'image') {
            formData.append(key, eventData[key]);
          }
        });
        
        // Add image file if present
        if (eventData.image) {
          formData.append('image', eventData.image);
        }
        
        return {
          url: '/events/create',
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ['Events'],
    }),
    
    getAllEvents: builder.query({
      query: () => '/events/all',
      providesTags: ['Events'],
    }),
    
    getEventById: builder.query({
      query: (eventId) => `/events/view/${eventId}`,
      providesTags: (result, error, id) => [{ type: 'Events', id }],
    }),
    
    updateEvent: builder.mutation({
      query: ({ eventId, eventData }) => {
        const formData = new FormData();
        
        // Add text data
        Object.keys(eventData).forEach(key => {
          if (key !== 'image') {
            formData.append(key, eventData[key]);
          }
        });
        
        // Add image file if present
        if (eventData.image) {
          formData.append('image', eventData.image);
        }
        
        return {
          url: `/events/update/${eventId}`,
          method: 'PUT',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: (result, error, { eventId }) => [{ type: 'Events', id: eventId }, 'Events'],
    }),
    
    deleteEvent: builder.mutation({
      query: (eventId) => ({
        url: `/events/delete/${eventId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Events'],
    }),
    
    addOrUpdateReaction: builder.mutation({
      query: ({ eventId, reactionData }) => ({
        url: `/events/${eventId}/reactions`,
        method: 'POST',
        body: reactionData,
      }),
      invalidatesTags: (result, error, { eventId }) => [{ type: 'Events', id: eventId }],
    }),
    
    deleteReaction: builder.mutation({
      query: (eventId) => ({
        url: `/events/${eventId}/reactions`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, eventId) => [{ type: 'Events', id: eventId }],
    }),
    
    getUsersWhoReacted: builder.query({
      query: (eventId) => `/events/${eventId}/reactions/users`,
    }),
    
    getReactionsForEvent: builder.query({
      query: (eventId) => `/events/${eventId}/reactions`,
    }),
  }),
});

export const {
  useCreateEventMutation,
  useGetAllEventsQuery,
  useGetEventByIdQuery,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useAddOrUpdateReactionMutation,
  useDeleteReactionMutation,
  useGetUsersWhoReactedQuery,
  useGetReactionsForEventQuery,
} = eventsApiSlice;