import asyncHandler from "express-async-handler";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";
import { Chat } from "../models/chatModel.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("Invalid data!");
    return res.sendStatus(400);
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);
    message = await message.populate(
      "sender",
      "name profile about phone email"
    );
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name profile email about phone",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      newMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name profile groupProfile email about phone") // Include about and phone fields
      .populate("chat");

    const formattedMessages = messages.map((message) => {
      const senderProfile =
        message.sender.profile || message.sender.groupProfile;
      return {
        _id: message._id,
        content: message.content,
        sender: {
          _id: message.sender._id,
          name: message.sender.name,
          profile: senderProfile, // Use profile or groupProfile based on availability
          email: message.sender.email,
          about: message.sender.about,
          phone: message.sender.phone,
        },
        chat: message.chat,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      };
    });

    res.json(formattedMessages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
