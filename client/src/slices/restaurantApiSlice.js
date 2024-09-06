import { apiSlice } from "./apiSlice";
import { restaurant_URL } from "./urlConstrains";
const restaurantApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRestaurant: builder.query({
      query: () => ({
        url: restaurant_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    restaurantGetById: builder.query({
      query: (restaurantId) => ({
        url: `${restaurant_URL}/${restaurantId}`,
      }),
      keepUnusedDataFor: 5,
      provideTags: ["Task"],
    }),
    addRestaurant: builder.mutation({
      query: (data) => ({
        url: `${restaurant_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    editRestaurant: builder.mutation({
      query: ({ restaurantId, data }) => ({
        url: `${restaurant_URL}/${restaurantId}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteRestaurant: builder.mutation({
      query: ({ restaurantId }) => ({
        url: `${restaurant_URL}/${restaurantId}`,
        method: "DELETE",
      }),
    }),
  }),
});
export const {
  useGetRestaurantQuery,
  useRestaurantGetByIdQuery,
  useAddRestaurantMutation,
  useEditRestaurantMutation,
  useDeleteRestaurantMutation,
} = restaurantApiSlice;
