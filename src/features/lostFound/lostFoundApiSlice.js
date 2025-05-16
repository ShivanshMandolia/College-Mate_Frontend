// src/features/lostFound/lostFoundApiSlice.js
import { apiSlice } from '../api/apiSlice';

export const lostFoundApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createFoundItem: builder.mutation({
      query: (itemData) => {
        const formData = new FormData();
        
        // Add text data
        Object.keys(itemData).forEach(key => {
          if (key !== 'image') {
            formData.append(key, itemData[key]);
          }
        });
        
        // Add image file if present
        if (itemData.image) {
          formData.append('image', itemData.image);
        }
        
        return {
          url: '/found-item',
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ['LostFound'],
    }),
    
    createClaimedRequest: builder.mutation({
      query: (claimData) => {
        const formData = new FormData();
        
        // Add text data
        Object.keys(claimData).forEach(key => {
          if (key !== 'image') {
            formData.append(key, claimData[key]);
          }
        });
        
        // Add image file if present
        if (claimData.image) {
          formData.append('image', claimData.image);
        }
        
        return {
          url: '/claimed-request',
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ['LostFound'],
    }),
    
    getAllFoundItems: builder.query({
      query: () => '/found-items',
      providesTags: ['LostFound'],
    }),
    
    getMyListings: builder.query({
      query: () => '/my-listings',
      providesTags: ['LostFound'],
    }),
    
    getMyRequests: builder.query({
      query: () => '/my-requests',
      providesTags: ['LostFound'],
    }),
    
    updateClaimStatus: builder.mutation({
      query: (statusData) => ({
        url: '/update-claim-status',
        method: 'POST',
        body: statusData,
      }),
      invalidatesTags: ['LostFound'],
    }),
    
    getClaimsForMyItem: builder.mutation({
      query: (itemId) => ({
        url: '/claims',
        method: 'POST',
        body: { itemId },
      }),
    }),
    
    createLostItemRequest: builder.mutation({
      query: (requestData) => {
        const formData = new FormData();
        
        // Add text data
        Object.keys(requestData).forEach(key => {
          if (key !== 'image') {
            formData.append(key, requestData[key]);
          }
        });
        
        // Add image file if present
        if (requestData.image) {
          formData.append('image', requestData.image);
        }
        
        return {
          url: '/request',
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ['LostFound'],
    }),
    
    getAllLostRequests: builder.query({
      query: () => '/requests',
      providesTags: ['LostFound'],
    }),
    
    getMyLostRequests: builder.query({
      query: () => '/my-requests',
      providesTags: ['LostFound'],
    }),
  }),
});

export const {
  useCreateFoundItemMutation,
  useCreateClaimedRequestMutation,
  useGetAllFoundItemsQuery,
  useGetMyListingsQuery,
  useGetMyRequestsQuery,
  useUpdateClaimStatusMutation,
  useGetClaimsForMyItemMutation,
  useCreateLostItemRequestMutation,
  useGetAllLostRequestsQuery,
  useGetMyLostRequestsQuery,
} = lostFoundApiSlice;