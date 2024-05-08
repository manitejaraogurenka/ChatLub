import { createSlice } from "@reduxjs/toolkit";

const homeSlice = createSlice({
  name: "home",
  initialState: {
    showLoginPage: true,
    isVisible: false,
    isVisible2: false,
    croppedPicture: "",
  },
  reducers: {
    login(state) {
      state.showLoginPage = true;
    },
    signUp(state) {
      state.showLoginPage = false;
    },
    showPassword(state) {
      state.isVisible = !state.isVisible;
    },
    showConfirmPassword(state) {
      state.isVisible2 = !state.isVisible2;
    },
    setCropedPicture(state, action) {
      state.croppedPicture = action.payload;
    },
  },
});

export const homeActions = homeSlice.actions;

export default homeSlice;
