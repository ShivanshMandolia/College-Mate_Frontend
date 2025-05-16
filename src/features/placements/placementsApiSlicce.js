// src/features/placements/placementsApiSlice.js
import { apiSlice } from '../api/apiSlice';

export const placementsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPlacement: builder.mutation({
      query: (placementData) => ({
        url: '/create',
        method: 'POST',
        body: placementData,
      }),
      invalidatesTags: ['Placements'],
    }),
    
    addPlacementUpdate: builder.mutation({
      query: ({ placementId, updateData }) => ({
        url: `/${placementId}/update`,
        method: 'POST',
        body: updateData,
      }),
      invalidatesTags: (result, error, { placementId }) => [
        { type: 'Placements', id: placementId },
        'Placements'
      ],
    }),
    
    registerForPlacement: builder.mutation({
      query: ({ placementId, registrationData }) => {
        const formData = new FormData();
        
        // Add text data
        Object.keys(registrationData).forEach(key => {
          if (key !== 'resume') {
            formData.append(key, registrationData[key]);
          }
        });
        
        // Add resume file if present
        if (registrationData.resume) {
          formData.append('resume', registrationData.resume);
        }
        
        return {
          url: `/${placementId}/register`,
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: (result, error, { placementId }) => [
        { type: 'Placements', id: placementId },
        'Placements'
      ],
    }),
    
    getAllPlacementsForStudent: builder.query({
      query: () => '/student/all',
      providesTags: ['Placements'],
    }),
    
    getPlacementDetails: builder.query({
      query: (placementId) => `/student/${placementId}`,
      providesTags: (result, error, id) => [{ type: 'Placements', id }],
    }),
    
    deletePlacement: builder.mutation({
      query: (placementId) => ({
        url: `/${placementId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Placements'],
    }),
    
    getAllPlacementsForAdmin: builder.query({
      query: () => '/admin/all',
      providesTags: ['Placements'],
    }),
    
    updateStudentStatus: builder.mutation({
      query: ({ placementId, statusData }) => ({
        url: `/${placementId}/update-status`,
        method: 'POST',
        body: statusData,
      }),
      invalidatesTags: (result, error, { placementId }) => [
        { type: 'Placements', id: placementId },
        'Placements'
      ],
    }),
    
    getAllRegisteredStudentsForPlacement: builder.query({
      query: (placementId) => `/${placementId}/registered-students`,
      providesTags: (result, error, id) => [{ type: 'Placements', id }],
    }),
  }),
});

export const {
  useCreatePlacementMutation,
  useAddPlacementUpdateMutation,
  useRegisterForPlacementMutation,
  useGetAllPlacementsForStudentQuery,
  useGetPlacementDetailsQuery,
  useDeletePlacementMutation,
  useGetAllPlacementsForAdminQuery,
  useUpdateStudentStatusMutation,
  useGetAllRegisteredStudentsForPlacementQuery,
} = placementsApiSlice;