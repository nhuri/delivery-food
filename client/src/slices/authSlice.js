import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfoOnLoginOrRegister(state, action) {
      state.userInfo = action.payload; // Set user info
    },
    logout(state) {
      state.userInfo = null; // Clear user info on logout
    },
  },
});

export const { setUserInfoOnLoginOrRegister, logout } = authSlice.actions;

export default authSlice.reducer;
