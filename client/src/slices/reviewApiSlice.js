import { apiSlice } from "./apiSlice";
import { REVIEWS_FOR_RESTAURANT_URL } from "./urlConstrains";
const reviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: (reviewTarget) => ({
        url: `reviews/${reviewTarget}`,
      }),
      keepUnusedDataFor: 5,
      provideTags: ["Reviews"],
    }),
    getTopThreeByRestaurantId: builder.query({
      query: (reviewTarget) => ({
        url: `/reviews/menuItemRestaurant/${reviewTarget}`,
      }),
      keepUnusedDataFor: 5,
      provideTags: ["Reviews"],
    }),
    // getReviewById: builder.query({
    //   query: (reviewId) => ({
    //     url: `${REVIEW_URL}/${reviewId}`,
    //   }),
    //   keepUnusedDataFor: 5,
    //   provideTags: ["reviews"],
    // }),
    // createReview: builder.mutation({
    //   query: (data) => ({
    //     url: `${REVIEW_URL}`,
    //     method: "POST",
    //     body: data,
    //   }),
    // }),
    // updateReview: builder.mutation({
    //   query: ({ reviewId, data }) => ({
    //     url: `${REVIEW_URL}/${reviewId}`,
    //     method: "PATCH",
    //     body: data,
    //   }),
    // }),
    // deleteReview: builder.mutation({
    //   query: ({ reviewId }) => ({
    //     url: `${REVIEW_URL}/${reviewId}`,
    //     method: "DELETE",
    //   }),
    // }),
  }),
});
export const {
  useGetReviewsQuery,
  useGetTopThreeByRestaurantIdQuery,
  useGetReviewByIdQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApiSlice;
