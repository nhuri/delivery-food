import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import { ORDER_URL } from './urlConstrains'; // Ensure this is correctly defined in your urlConstrains

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    clientSecret: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetPayment: (state) => {
      state.clientSecret = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    setPaymentSuccess: (state) => {
      state.success = true;
    },
    setPaymentError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { resetPayment, setPaymentSuccess, setPaymentError } = paymentSlice.actions;

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation({
      query: (amount) => ({
        url: `${ORDER_URL}/payment`, // Adjusted to match the new route
        method: 'POST',
        body: { amount }, // Pass the amount as part of the request body
      }),
      // Optional: Add tags for invalidation if necessary
      invalidatesTags: ['Payment'],
    }),
    confirmPayment: builder.mutation({
      query: (paymentMethodId) => ({
        url: `${ORDER_URL}/confirm`, // Adjusted to match the new route
        method: 'POST',
        body: { paymentMethodId }, // Send payment method ID for confirmation
      }),
      // Optional: Add tags for invalidation if necessary
      invalidatesTags: ['Payment'],
    }),
  }),
});

// Export hooks for usage in functional components
export const { useCreatePaymentIntentMutation, useConfirmPaymentMutation } = paymentApiSlice;

export default paymentSlice.reducer;
