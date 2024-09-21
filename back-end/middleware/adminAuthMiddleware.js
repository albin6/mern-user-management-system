import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

export const verifyAdmin = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwtAdmin;
  console.log("Admin Token", req.cookies);
  if (token) {
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decoded token", decode);
      const usr = await User.findById(decode.user).select("-password");
      console.log("user details", usr);
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});
