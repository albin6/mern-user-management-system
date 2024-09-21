import express from "express";
import {
  authUser,
  registerUser,
  logout,
  updateUserProfile,
  getUserDetails,
} from "../controllers/userController.js";
import { verifyUser } from "../middleware/authMiddleware.js";
import { upload } from "../multer/multer.js";
const userRoute = express.Router();

userRoute.get("/:id", verifyUser, getUserDetails);
userRoute.post("/register", upload, registerUser);
userRoute.post("/auth", authUser);
userRoute.post("/logout", verifyUser, logout);
userRoute.put("/profile", verifyUser, upload, updateUserProfile);

export default userRoute;
