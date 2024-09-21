import express from "express";
import {
  verifyAdminLogin,
  getUsersLists,
  logoutAdmin,
  getUserDetails,
  editUserProfile,
  deleteUser,
  addUser,
} from "../controllers/adminController.js";
import { verifyAdmin } from "../middleware/adminAuthMiddleware.js";
import { upload } from "../multer/multer.js";
const adminRoute = express.Router();

adminRoute.post("/login", verifyAdminLogin);
adminRoute.post("/logout", logoutAdmin);
adminRoute.get("/usersList", verifyAdmin, getUsersLists);
adminRoute.post("/addUser", verifyAdmin, addUser);
adminRoute.delete("/deleteUser/:id", verifyAdmin, deleteUser);
adminRoute.get("/users/:id", verifyAdmin, getUserDetails);
adminRoute.put("/editUser/:id", upload, editUserProfile);

export default adminRoute;
