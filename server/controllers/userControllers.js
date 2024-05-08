import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";
import generateToken from "../config/generateToken.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, profile } = req.body;
  if (!name || !email || !password) {
    res.status(400).send({ error: "Please enter all the fields!" });
    return;
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).send({ error: "Please use a unique email" });
    return;
  }

  const user = await User.create({
    name,
    email,
    password,
    profile: profile || "/assets/logo/profilePic.jpg",
    about: "I'm a ChatLub user!",
    phone: null,
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      profile: user.profile,
      about: user.about,
      phone: user.phone,
      token: generateToken(user.id),
    });
  } else {
    res.status(400).send({ error: "Failed to create user" });
  }
});

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400).send({ error: "Email not registered. SignUp now!" });
    return;
  }

  if (!(await user.matchPassword(password))) {
    res.status(400).send({ error: "Incorrect password!" });
    return;
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    profile: user.profile || "/assets/logo/profilePic.jpg",
    about: user.about,
    phone: user.phone,
    token: generateToken(user.id),
  });
});

export const editUser = asyncHandler(async (req, res) => {
  const { userId, field, value } = req.body;
  const updateFields = {};

  if (
    field === "name" ||
    field === "profile" ||
    field === "about" ||
    field === "phone"
  ) {
    updateFields[field] = value;
  } else {
    res.status(400).send({ error: "Invalid field name" });
    return;
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
    new: true,
    select: { password: 0 }, // Exclude the password field
  });

  if (!updatedUser) {
    res.status(404);
    throw new Error("User not updated!");
  }

  res.json({
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    profile: updatedUser.profile,
    about: updatedUser.about,
    phone: updatedUser.phone,
  });
});

export const getUser = asyncHandler(async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const profilePicture = user.profile || "";

    return res.status(200).json({ profilePicture });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// /api/user?search=Maniteja
export const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: `${req.query.search}(?=.*@)`, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find({ ...keyword, _id: { $ne: req.user._id } });
  if (users.length > 0) {
    res.send(users);
  } else {
    res.status(404).send({ message: "No users found" });
  }
});
