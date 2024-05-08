import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    user: "",
    search: "",
    searchResult: "",
    profilePicture: "",
    selectedChat: "",
    chats: [],
    isModalOpen: false,
    fetchChatsAgain: false,
    userName: "",
    updateProfile: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
    setSearchResult(state, action) {
      state.searchResult = action.payload;
    },
    setProfilePicture(state, action) {
      state.profilePicture = action.payload;
    },
    setSelectedChat(state, action) {
      state.selectedChat = action.payload;
    },
    setChats(state, action) {
      state.chats = action.payload;
    },
    setModalOpen(state, action) {
      state.isModalOpen = action.payload;
    },
    setFetchChats(state, action) {
      state.fetchChatsAgain = action.payload;
    },
    updateUserName(state, action) {
      state.userName = action.payload;
    },
    setUpdateProfile(state, action) {
      state.updateProfile = action.payload;
    },
  },
});
export const chatActions = chatSlice.actions;
export default chatSlice;
