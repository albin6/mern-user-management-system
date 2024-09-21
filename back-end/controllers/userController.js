import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateJWT from "../utils/generateJWT.js";
import bcrypt from "bcrypt";

const securePassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    console.log(error);
  }
};

// Auth user
// POST /api/users/auth
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    if (await bcrypt.compare(password, user.password)) {
      generateJWT(res, user._id);
      console.log(res);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
      throw new Error("Invalid email or password");
    }
  } else {
    return res
      .status(401)
      .json({ message: "Credentials not found. Please create a new account." });
  }
});

// Register a new user
// POST /api/users/register
const registerUser = asyncHandler(async (req, res) => {
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
    console.log("user registered successfully");
    res.json(user);
  }
});

// Logout user & clear cookies
// POST /api/users/logout
const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out" });
});

const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "name email profileImage"
  ); // Select the fields you need
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

// Update user profile
// PUT /api/users/profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { id, name, email, password } = req.body;
  const profileImage = req.file ? req.file.filename : undefined;

  // Find the user by ID
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the email is being changed and if the new email already exists in the database
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
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

  if (password) {
    const passwordHash = await securePassword(password);
    user.password = passwordHash;
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

export { authUser, registerUser, logout, updateUserProfile, getUserDetails };
