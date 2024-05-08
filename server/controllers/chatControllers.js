import asyncHandler from "express-async-handler";
import { Chat } from "../models/chatModel.js";
import { User } from "../models/userModel.js";

export const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("newMessage");

  isChat = await User.populate(isChat, {
    path: "newMessage.sender",
    select: "name profile email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

export const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("newMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "newMessage.sender",
          select: "name profile email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the feilds" });
  }
  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("Minimum 2 users are required to create a group!");
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      groupProfile: req.body.groupProfile,
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
      createdBy: req.user.name,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const editGroup = asyncHandler(async (req, res) => {
  const { chatId, ...updateFields } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(chatId, updateFields, {
    new: true,
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat not found");
  }

  res.json(updatedChat);
});

export const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, users } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: { $each: users } } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(added);
  }
});

export const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!removed) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(removed);
  }
});

export const makeGroupAdmin = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const madeAdmin = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { groupAdmin: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!madeAdmin) {
    res.status(404);
    throw new Error("Couldnt make Admin!");
  } else {
    res.json(madeAdmin);
  }
});

export const removeGroupAdmin = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const removedAdmin = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { groupAdmin: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!removedAdmin) {
    res.status(404);
    throw new Error("Couldn't remove Admin!");
  } else {
    res.json(removedAdmin);
  }
});
