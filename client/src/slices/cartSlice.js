// src/slices/cartSlice.js

import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItemIndex = state.items.findIndex(item =>
        item.id === action.payload.id &&
        JSON.stringify(item.extras) === JSON.stringify(action.payload.extras) &&
        JSON.stringify(item.ingredients) === JSON.stringify(action.payload.ingredients)
      );
      if (existingItemIndex !== -1) {
        state.items[existingItemIndex].quantity += 1;
        // Update the totalPrice
        state.items[existingItemIndex].totalPrice = (
          parseFloat(state.items[existingItemIndex].totalPrice) +
          parseFloat(action.payload.totalPrice)
        ).toFixed(2);

      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item =>
        !(item.id === action.payload.id &&
          JSON.stringify(item.extras) === JSON.stringify(action.payload.extras) &&
          JSON.stringify(item.ingredients) === JSON.stringify(action.payload.ingredients))
      );
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, quantity, extras, ingredients } = action.payload;
      const item = state.items.find(item =>
        item.id === id &&
        JSON.stringify(item.extras) === JSON.stringify(extras) &&
        JSON.stringify(item.ingredients) === JSON.stringify(ingredients)
      );
      if (item) {
        item.quantity = quantity;
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    loadCart: (state) => {
      // Load cart items from localStorage
      const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
      state.items = savedCart;
    },
    clearCart : (state) => {
      state.items = [];
      localStorage.removeItem('cart'); // Clear cart from localStorage as well
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, loadCart, clearCart   } = cartSlice.actions;

export default cartSlice.reducer;