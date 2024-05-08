import { createSlice } from "@reduxjs/toolkit";

const lightDarkSlice = createSlice({
  name: "lightDark",
  initialState: { isLight: false },
  reducers: {
    setDark(state) {
      state.isLight = !state.isLight;
    },
  },
});

export const lightDarkActions = lightDarkSlice.actions;
export default lightDarkSlice;
