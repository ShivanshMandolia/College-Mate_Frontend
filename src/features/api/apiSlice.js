import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logOut } from '../auth/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://college-mate-backend-1.onrender.com/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include', // for sending refresh token cookies
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Try to refresh the access token
    const refreshResult = await baseQuery('/refresh-token', api, extraOptions);

    if (refreshResult?.data) {
      api.dispatch(setCredentials({ accessToken: refreshResult.data.accessToken }));
      // Retry the original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Complaints', 'Events', 'LostFound', 'Placements', 'Notifications'],
  endpoints: (builder) => ({}), // Add endpoints in slices
});
