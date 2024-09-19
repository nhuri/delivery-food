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
    },
  },
});
export const { setUserInfoOnLoginOrRegister, logout } = authSlice.actions;

export default authSlice.reducer;
