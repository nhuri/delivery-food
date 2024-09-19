import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: null,
  },
    reducers: {
    setUserInfoOnLoginOrRegister: (state, action) => {
      // console.log(action);

      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },
  },
});
export const { setUserInfoOnLoginOrRegister, logout } = authSlice.actions;

export default authSlice.reducer;
