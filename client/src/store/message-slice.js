import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    fetchMessagesAgain: false,
    notifications: [],
  },
  reducers: {
    setFetchMessages(state, action) {
      state.fetchMessagesAgain = action.payload;
    },
    setNotifications(state, action) {
      state.notifications = action.payload;
    },
  },
});
export const messageActions = messageSlice.actions;
export default messageSlice;
