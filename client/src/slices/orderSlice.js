import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import { ORDER_URL } from "./urlConstrains";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    currentOrderId: null,
  },
  reducers: {
    setCurrentOrderId: (state, action) => {
      state.currentOrderId = action.payload;
    },
  },
});

export const { setCurrentOrderId } = orderSlice.actions;

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: `${ORDER_URL}/createOrder`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
    addItemToOrder: builder.mutation({
      query: ({ orderId, ...data }) => ({
        url: `${ORDER_URL}/${orderId}/addItemToOrder`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
    getOrderById: builder.query({
      query: (orderId) => ({
        url: `${ORDER_URL}/${orderId}`,
      }),
      providesTags: ["Order"],
    }),
    updateOrder: builder.mutation({
      query: ({ orderId, menuItemId, quantity }) => ({
        url: `${ORDER_URL}/${orderId}/updateItem`,
        method: 'PATCH',
        body: { menuItemId, quantity },
      }),
      invalidatesTags: ['Order'],
    }),
    finalizeOrder: builder.mutation({
      query: ({ orderId, ...data }) => ({
        url: `${ORDER_URL}/${orderId}/finalizeOrder`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useAddItemToOrderMutation,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
  useFinalizeOrderMutation,
} = orderApiSlice;

export default orderSlice.reducer;