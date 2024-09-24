import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const statisticsApiSlice = createApi({
  reducerPath: 'statisticsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // Adjust the base URL as needed
  endpoints: (builder) => ({
    getRestaurantStatistics: builder.query({
      query: (restaurantId) => `statistics/${restaurantId}`, // Adjust the endpoint as needed
    }),
  }),
});

export const { useGetRestaurantStatisticsQuery } = statisticsApiSlice;