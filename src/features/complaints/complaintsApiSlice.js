// src/features/complaints/complaintsApiSlice.js
import { apiSlice } from '../api/apiSlice';

export const complaintsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createComplaint: builder.mutation({
      query: (complaintData) => {
        const formData = new FormData();
        
        // Add text data
        Object.keys(complaintData).forEach(key => {
          if (key !== 'image') {
            formData.append(key, complaintData[key]);
          }
        });
        
        // Add image file if present
        if (complaintData.image) {
          formData.append('image', complaintData.image);
        }
        
        return {
          url: '/comp/complaints',
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ['Complaints'],
    }),
    
    getMyComplaints: builder.query({
      query: () => '/comp/my-complaints',
      providesTags: ['Complaints'],
    }),
    
    getAllComplaints: builder.query({
      query: () => '/comp/all-complaints',
      providesTags: ['Complaints'],
    }),
    
    getComplaintById: builder.query({
      query: (complaintId) => `/comp/complaints/${complaintId}`,
      providesTags: (result, error, complaintId) => [
        { type: 'Complaints', id: complaintId },
      ],
    }),
    
    updateComplaintStatus: builder.mutation({
      query: (statusData) => ({
        url: '/comp/update-complaint-status',
        method: 'POST',
        body: statusData,
      }),
      invalidatesTags: ['Complaints'],
    }),
    
    deleteComplaint: builder.mutation({
      query: (complaintId) => ({
        url: `/comp/complaints/${complaintId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Complaints'],
    }),
    
    assignComplaintToAdmin: builder.mutation({
      query: ({ complaintId, assignedTo }) => ({
        url: `/comp/assign-complaint/${complaintId}/${assignedTo}`,
        method: 'POST',
      }),
      invalidatesTags: ['Complaints'],
    }),
    
    getAdminComplaintStatus: builder.query({
      query: () => '/comp/admin-status',
      providesTags: ['AdminStatus'],
    }),
    
    getComplaintNotifications: builder.query({
      query: () => '/comp/notifications',
      providesTags: ['Notifications'],
    }),
    
    searchComplaints: builder.query({
      query: (searchQuery) => `/comp/search-complaints?query=${encodeURIComponent(searchQuery)}`,
      providesTags: ['Complaints'],
    }),
  }),
});

export const {
  useCreateComplaintMutation,
  useGetMyComplaintsQuery,
  useGetAllComplaintsQuery,
  useGetComplaintByIdQuery,
  useUpdateComplaintStatusMutation,
  useDeleteComplaintMutation,
  useAssignComplaintToAdminMutation,
  useGetAdminComplaintStatusQuery,
  useGetComplaintNotificationsQuery,
  useSearchComplaintsQuery,
} = complaintsApiSlice;