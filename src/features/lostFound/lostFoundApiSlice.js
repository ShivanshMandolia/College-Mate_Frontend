// src/features/lostFound/lostFoundApiSlice.js
import { apiSlice } from '../api/apiSlice';

export const lostFoundApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new found item
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
          url: '/items/found-item',
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ['LostFound'],
    }),
    
    // Create a new lost item request
    createLostItem: builder.mutation({
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
          url: '/items/lost-item',
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ['LostFound'],
    }),
    
    // Get all found items
    getAllFoundItems: builder.query({
      query: () => '/items/found-items',
      providesTags: ['LostFound'],
    }),
    
    // Get all lost items
    getAllLostItems: builder.query({
      query: () => '/items/lost-items',
      providesTags: ['LostFound'],
    }),
    
    // Get a specific found item by ID
    getFoundItemById: builder.query({
      query: (itemId) => `/items/found-item/${itemId}`,
      providesTags: (result, error, itemId) => [
        { type: 'LostFound', id: itemId }
      ],
    }),
    
    // Get a specific lost item by ID
    getLostItemById: builder.query({
      query: (requestId) => `/items/lost-item/${requestId}`,
      providesTags: (result, error, requestId) => [
        { type: 'LostFound', id: requestId }
      ],
    }),
    
    // Delete a found item
    deleteFoundItem: builder.mutation({
      query: (itemId) => ({
        url: `/items/found-item/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LostFound'],
    }),
    
    // Delete a lost item
    deleteLostItem: builder.mutation({
      query: (itemId) => ({
        url: `/items/lost-item/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LostFound'],
    }),
    
    // Get found items posted by the logged-in user
    getMyFoundListings: builder.query({
      query: () => '/items/my-found-listings',
      providesTags: ['LostFound'],
    }),
    
    // Get lost items posted by the logged-in user
    getMyLostListings: builder.query({
      query: () => '/items/my-lost-listings',
      providesTags: ['LostFound'],
    }),
  }),
});

export const {
  useCreateFoundItemMutation,
  useCreateLostItemMutation,
  useGetAllFoundItemsQuery,
  useGetAllLostItemsQuery,
  useGetFoundItemByIdQuery,
  useGetLostItemByIdQuery,
  useDeleteFoundItemMutation,
  useDeleteLostItemMutation,
  useGetMyFoundListingsQuery,
  useGetMyLostListingsQuery,
} = lostFoundApiSlice;