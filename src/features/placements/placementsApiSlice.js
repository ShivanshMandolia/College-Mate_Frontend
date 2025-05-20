// src/features/placements/placementsApiSlice.js
import { apiSlice } from '../api/apiSlice';

export const placementsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // === SuperAdmin and Admin Endpoints ===
    createPlacement: builder.mutation({
      query: (placementData) => ({
        url: '/placement/create',
        method: 'POST',
        body: placementData,
      }),
      invalidatesTags: ['Placements'],
    }),
    
    // Get all admins (for SuperAdmin to assign placements)
    getAllAdmins: builder.query({
      query: () => '/placement/all-admins',  // Updated endpoint path
      providesTags: ['Admins'],
    }),
    
    // Assign placement to admin
    assignPlacementToAdmin: builder.mutation({
      query: ({ placementId, adminId }) => ({
        url: `/placement/${placementId}/assign-admin`,
        method: 'POST',
        body: { adminId },
      }),
      invalidatesTags: (result, error, { placementId }) => [
        { type: 'Placements', id: placementId },
        'Placements'
      ],
    }),
    
    // === SuperAdmin specific endpoints ===
    // Get all placements (SuperAdmin view)
    getAllPlacements: builder.query({
      query: () => '/placement/admin/all',
      providesTags: ['Placements'],
    }),
    
    // === Admin specific endpoints ===
    addPlacementUpdate: builder.mutation({
      query: ({ placementId, updateData }) => ({
        url: `/placement/${placementId}/update`,
        method: 'POST',
        body: updateData,
      }),
      invalidatesTags: (result, error, { placementId }) => [
        { type: 'Placements', id: placementId },
        'Placements'
      ],
    }),
    
    // Get all placements assigned to an admin
    getAllPlacementsForAdmin: builder.query({
      query: () => '/placement/admin/all',
      providesTags: ['Placements'],
    }),
    
    // Update student status in a placement
    updateStudentStatus: builder.mutation({
      query: ({ placementId, statusData }) => ({
        url: `/placement/${placementId}/update-status`,
        method: 'POST',
        body: statusData,
      }),
      invalidatesTags: (result, error, { placementId }) => [
        { type: 'Placements', id: placementId },
        'Placements'
      ],
    }),
    
    // Get all registered students for a placement
    getAllRegisteredStudentsForPlacement: builder.query({
      query: (placementId) => `/placement/${placementId}/registered-students`,
      providesTags: (result, error, id) => [{ type: 'Placements', id }],
    }),
    
    // === Student specific endpoints ===
    // Register for a placement
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
          url: `/placement/${placementId}/register`,
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
    
    // Get all placements available for students
    getAllPlacementsForStudent: builder.query({
      query: () => '/placement/student/all',
      providesTags: ['Placements'],
    }),
    
    // Common endpoints
    getPlacementDetails: builder.query({
      query: (placementId) => `/placement/${placementId}`,
      providesTags: (result, error, id) => [{ type: 'Placements', id }],
    }),
    
    deletePlacement: builder.mutation({
      query: (placementId) => ({
        url: `/placement/${placementId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Placements'],
    }),
  }),
});

export const {
  // SuperAdmin and Admin hooks
  useCreatePlacementMutation,
  useGetAllAdminsQuery,
  useAssignPlacementToAdminMutation,
  
  // SuperAdmin specific hooks
  useGetAllPlacementsQuery,
  
  // Admin specific hooks
  useAddPlacementUpdateMutation,
  useGetAllPlacementsForAdminQuery,
  useUpdateStudentStatusMutation,
  useGetAllRegisteredStudentsForPlacementQuery,
  
  // Student specific hooks
  useRegisterForPlacementMutation,
  useGetAllPlacementsForStudentQuery,
  
  // Common hooks
  useGetPlacementDetailsQuery,
  useDeletePlacementMutation,
} = placementsApiSlice;