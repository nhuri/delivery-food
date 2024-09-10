import { apiSlice } from "./apiSlice";
import { RESTAURANT_URL } from "./urlConstrains";
const restaurantApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRestaurant: builder.query({
      query: () => ({
        url: RESTAURANT_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    restaurantGetById: builder.query({
      query: (restaurantId) => ({
        url: `${RESTAURANT_URL}/${restaurantId}`,
      }),
      keepUnusedDataFor: 5,
      provideTags: ["Task"],
    }),
    addRestaurant: builder.mutation({
      query: (data) => ({
        url: `${RESTAURANT_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    editRestaurant: builder.mutation({
      query: ({ restaurantId, data }) => ({
        url: `${RESTAURANT_URL}/${restaurantId}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteRestaurant: builder.mutation({
      query: ({ restaurantId }) => ({
        url: `${RESTAURANT_URL}/${restaurantId}`,
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
