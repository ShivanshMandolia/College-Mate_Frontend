// src/features/auth/authApiSlice.js
import { apiSlice } from '../api/apiSlice';
import { setCredentials, logOut } from './authSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => {
        const formData = new FormData();
        Object.keys(credentials).forEach((key) => {
          if (key === 'avatar') {
            formData.append('avatar', credentials.avatar);
          } else {
            formData.append(key, credentials[key]);
          }
        });

        return {
          url: '/register',
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Make sure your backend sends user with role and isSuperAdmin in the response
          dispatch(
            setCredentials({
              user: data.data.user,
              accessToken: data.data.accessToken,
            })
          );
        } catch (err) {
          // Handle error if needed
        }
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
        } catch (error) {
          console.log(error);
          // Handle error if needed
        }
      },
    }),

    refreshToken: builder.mutation({
      query: () => ({
        url: '/refresh-token',
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              // Only updating accessToken here, user data remains same
              accessToken: data.data.accessToken,
              user: data.data.user, // Optional: include user if your backend sends it here
            })
          );
        } catch (err) {
          dispatch(logOut());
        }
      },
    }),

    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: '/change-password',
        method: 'POST',
        body: passwordData,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useChangePasswordMutation,
} = authApiSlice;
