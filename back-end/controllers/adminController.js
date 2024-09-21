import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import adminJWT from "../utils/adminJWT.js";
import AsyncHandler from "express-async-handler";

export const verifyAdminLogin = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const adminInfo = await User.findOne({ email });
  if (adminInfo?.isAdmin) {
    if (adminInfo) {
      if (await bcrypt.compare(password, adminInfo.password)) {
        adminJWT(res, adminInfo._id);
        res.json({
          _id: adminInfo._id,
          name: adminInfo.name,
          password: adminInfo.password,
        });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
        throw new Error("Invalid email or password");
      }
    } else {
      return res.status(401).json({
        message: "Credentials not found. Please create a new account.",
      });
    }
  } else {
    return res.status(401).json({
      message: "No Access!!",
    });
  }
});

export const getUsersLists = AsyncHandler(async (req, res) => {
  const users = await User.find({ isAdmin: { $ne: true } });
  res.status(200).json(users);
});

export const logoutAdmin = AsyncHandler(async (req, res) => {
  res.cookie("jwtAdmin", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out" });
});

export const getUserDetails = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "name email profileImage"
  ); // Select the fields you need
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

export const editUserProfile = AsyncHandler(async (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;
  const profileImage = req.file ? req.file.filename : undefined;

  // Find the user by ID
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the email is being changed and if the new email already exists in the database
  if (email && email !== user.email) {
    console.log(email);
    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
  }

  // Check if changes are made and update only changed fields
  let isUpdated = false;

  if (name && name !== user.name) {
    user.name = name;
    isUpdated = true;
  }

  if (email && email !== user.email) {
    user.email = email;
    isUpdated = true;
  }

  if (profileImage && profileImage !== user.profileImage) {
    user.profileImage = profileImage;
    isUpdated = true;
  }

  // If no fields are updated, respond with a message
  if (!isUpdated) {
    return res.status(200).json({ message: "No changes made" });
  }

  // Save the updated user
  const updatedUser = await user.save();

  // Respond with the updated user details
  res.status(200).json({
    name: updatedUser.name,
    email: updatedUser.email,
    profileImage: updatedUser.profileImage,
  });
});

export const deleteUser = AsyncHandler(async (req, res) => {
  const id = req.params.id;
  await User.deleteOne({ _id: id });
  const users = await User.find({ isAdmin: { $ne: true } });
  res.status(200).json({ users, message: "User deleted successfully" });
});

export const addUser = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const image = req.file ? req.file.path : null;

  const isEmailExists = await User.findOne({ email });
  if (isEmailExists) {
    res.status(409).json({ message: "User already exists" });
    throw new Error("User already exists");
  } else {
    const passwordHash = await securePassword(password);
    const user = await User.create({
      name: name,
      email: email,
      password: passwordHash,
      profileImage: image,
    });
    generateJWT(res, user._id);
    console.log("user registered successfully");
    res.json(user);
  }
});
