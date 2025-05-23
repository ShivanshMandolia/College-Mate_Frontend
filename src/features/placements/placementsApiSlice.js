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
     getPlacementDetails: builder.query({
      query: (placementId) => `/placement/${placementId}`,
      providesTags: (result, error, id) => [{ type: 'Placements', id }],
      transformResponse: (response) => {
        console.log('Raw API response in getPlacementDetails:', response);
        // Return the full response structure to maintain access to success, data, etc.
        return response;
      }
    }),
    // Get all admins (for SuperAdmin to assign placements)
    getAllAdmins: builder.query({
      query: () => '/placement/all-admins',
      providesTags: ['Admins'],
      transformResponse: (response) => {
        // Handle both response structures
        if (response?.success && response?.data) {
          return response.data;
        }
        return response?.data || [];
      }
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
      transformResponse: (response) => {
        // Handle both response structures
        if (response?.success && response?.data) {
          return response.data;
        }
        return response?.data || [];
      }
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
    
    // Get all placements assigned to an admin - FIXED VERSION
    getAllPlacementsForAdmin: builder.query({
      query: () => '/placement/admin/all',
      providesTags: ['Placements'],
      // DON'T transform the response here - keep the full response structure
      // The component will handle response.data
      transformResponse: (response) => {
        console.log('Raw API response in getAllPlacementsForAdmin:', response);
        // Return the full response so components can access response.success, response.data, etc.
        return response;
      }
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
      transformResponse: (response) => {
        console.log('Raw API response in getAllRegisteredStudentsForPlacement:', response);
        // Return the full response so we can handle both structures in the component
        return response;
      }
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
    
 // Fixed API query - update your placementsApiSlice.js
getAllPlacementsForStudent: builder.query({
  query: () => '/placement/student/all',
  providesTags: ['Placements'],
  transformResponse: (response) => {
    console.log('Raw API response in transformResponse:', response);
    
    // If response has the expected structure { data: [...], success: true }
    if (response?.success && Array.isArray(response?.data)) {
      console.log('Returning response.data:', response.data);
      return response.data; // Return the data array directly
    }
    
    // If response is already an array
    if (Array.isArray(response)) {
      console.log('Response is already an array:', response);
      return response;
    }
    
    // If data is nested deeper
    if (response?.data && Array.isArray(response.data)) {
      console.log('Returning nested data:', response.data);
      return response.data;
    }
    
    console.error('Unexpected response structure:', response);
    return []; // Fallback to empty array
  }
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