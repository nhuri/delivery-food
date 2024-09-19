// import { isAuth } from "../../../server/controllers/authController";
// import { isAuth } from "../../../server/controllers/authController";
import { apiSlice } from "./apiSlice";
import { USER_URL } from "./urlConstrains";
const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: USER_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getUserById: builder.query({
      query: (userId) => ({
        url: `${USER_URL}/${userId}`,
      }),
      keepUnusedDataFor: 5,
      provideTags: ["User"],
    }),
    getNearbyRestaurants: builder.query({
      query: (userID) => ({
        url: `users/restaurants/nearby/${userID}`,
      }),
      keepUnusedDataFor: 5,
      provideTags: ["User"],
    }),
    // isAuth: builder.query({
    //   query: () => ({
    //     url: `${USER_URL}/isAuth`,
    //   }),
    //   keepUnusedDataFor: 5,
    //   withCredentials: true,
    // }),
    verifyToken: builder.query({
      query: () => ({
        url: `${USER_URL}/verify-token`,
        method: "GET",
      }),
    }),
    registerUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    logoutUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/logout`,
        method: "POST",
        body: data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/forgotPassword`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useGetNearbyRestaurantsQuery,
  useIsAuthQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useForgotPasswordMutation,
  useVerifyTokenQuery,
} = userApiSlice;
