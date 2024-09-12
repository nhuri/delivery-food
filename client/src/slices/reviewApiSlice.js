import { apiSlice } from "./apiSlice";
import { REVIEW_URL } from "./urlConstrains";
const reviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: (reviewType, reviewTarget) => ({
        url: `${REVIEW_URL}/${reviewType}/${reviewTarget}`,
      }),
      keepUnusedDataFor: 5,
      provideTags: ["reviews"],
    }),
    getReviewById: builder.query({
      query: (reviewId) => ({
        url: `${REVIEW_URL}/${reviewId}`,
      }),
      keepUnusedDataFor: 5,
      provideTags: ["reviews"],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${REVIEW_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    updateReview: builder.mutation({
      query: ({ reviewId, data }) => ({
        url: `${REVIEW_URL}/${reviewId}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteReview: builder.mutation({
      query: ({ reviewId }) => ({
        url: `${REVIEW_URL}/${reviewId}`,
        method: "DELETE",
      }),
    }),
  }),
});
export const {
  useGetReviewsQuery,
  useGetReviewByIdQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApiSlice;
