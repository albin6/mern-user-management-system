import jwt from "jsonwebtoken";

function adminJWT(res, user) {
  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwtAdmin", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

export default adminJWT;
