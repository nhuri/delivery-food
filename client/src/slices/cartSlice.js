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
      const newItem = action.payload;
      const existingItem = state.items.find(item => 
        item._id === newItem._id &&
        JSON.stringify(item.selectedExtras) === JSON.stringify(newItem.selectedExtras) &&
        JSON.stringify(item.selectedIngredients) === JSON.stringify(newItem.selectedIngredients)
      );
  
      if (existingItem) {
        // Added: Update quantity and price if item exists
        console.log("existingItem:")
        console.log(existingItem)
        existingItem.quantity += 1;
        // existingItem.price += newItem.price;
      } else {
        // Added: Add new item if it doesn't exist
        console.log("new item")
        state.items.push({ ...newItem, quantity: 1 });
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
        item.quantity = Math.max(item.quantity - 1, 0);
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