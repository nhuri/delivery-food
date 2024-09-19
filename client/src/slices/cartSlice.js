import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return [];
  }
};

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem('cart', JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (existingItem) {
        // Added: Ensure quantity is a number
        existingItem.quantity = (existingItem.quantity || 0) + (action.payload.quantity || 1);
      } else {
        // Added: Ensure new item has a quantity
        state.items.push({...action.payload, quantity: action.payload.quantity || 1});
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      saveCartToStorage(state.items);
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find(item => item._id === action.payload);
      if (item) {
        // Added: Ensure quantity doesn't go below 0
        item.quantity = Math.max((item.quantity || 0) - 1, 0);
        if (item.quantity === 0) {
          state.items = state.items.filter(i => i._id !== action.payload);
        }
        saveCartToStorage(state.items);
      }
    },
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, decreaseQuantity, setCartItems, setLoading, setError } = cartSlice.actions;

export default cartSlice.reducer;