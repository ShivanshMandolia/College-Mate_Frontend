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
          url: '/complaints',
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ['Complaints'],
    }),
    
    getMyComplaints: builder.query({
      query: () => '/my-complaints',
      providesTags: ['Complaints'],
    }),
    
    getAllComplaints: builder.query({
      query: () => '/all-complaints',
      providesTags: ['Complaints'],
    }),
    
    updateComplaintStatus: builder.mutation({
      query: (statusData) => ({
        url: '/update-complaint-status',
        method: 'POST',
        body: statusData,
      }),
      invalidatesTags: ['Complaints'],
    }),
    
    deleteComplaint: builder.mutation({
      query: (complaintId) => ({
        url: `/complaints/${complaintId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Complaints'],
    }),
    
    assignComplaint: builder.mutation({
      query: (assignData) => ({
        url: '/assign-complaint',
        method: 'POST',
        body: assignData,
      }),
      invalidatesTags: ['Complaints'],
    }),
    
    searchComplaints: builder.query({
      query: (searchQuery) => `/search-complaints?query=${searchQuery}`,
    }),
  }),
});

export const {
  useCreateComplaintMutation,
  useGetMyComplaintsQuery,
  useGetAllComplaintsQuery,
  useUpdateComplaintStatusMutation,
  useDeleteComplaintMutation,
  useAssignComplaintMutation,
  useSearchComplaintsQuery,
} = complaintsApiSlice;