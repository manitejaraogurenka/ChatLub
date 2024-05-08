import mongoose from "mongoose";

const chatModal = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    groupProfile: { type: String },
    groupAbout: { type: String, default: "Welcome to chatLub!" },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    newMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Chat = mongoose.model("Chat", chatModal);
