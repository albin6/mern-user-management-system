import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { __dirname } from "./utils/PathUtil.js";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDB.js";
import userRoute from "./routes/userRoutes.js";
import adminRoute from "./routes/adminRoutes.js";
const app = express();

dotenv.config();

connectDB();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "multer", "uploads"))
);

app.use("/api/users", userRoute);
app.use("/api/admin", adminRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
