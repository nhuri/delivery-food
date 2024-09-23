import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import authSliceReducer from "./slices/authSlice";
import orderReducer from './slices/orderSlice';
import cartReducer from './slices/cartSlice'; 
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "redux";

// Persist configuration for auth slice
const persistConfig = {
  key: "auth",
  storage,
};

// Combine reducers if needed
const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: persistReducer(persistConfig, authSliceReducer), // Add persistReducer here
  order: orderReducer,
  cart: cartReducer,
});

// Configure store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
  devTools: true,
});

// Persistor
export const persistor = persistStore(store);

export default store;