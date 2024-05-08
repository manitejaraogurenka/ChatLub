import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import homeSlice from "./home-slice";
import chatSlice from "./chat-slice";
import lightDarkSlice from "./lightDark";
import messageSlice from "./message-slice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  home: homeSlice.reducer,
  chat: chatSlice.reducer,
  message: messageSlice.reducer,
  lightDark: lightDarkSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

let persistor = persistStore(store);

export { store, persistor };
