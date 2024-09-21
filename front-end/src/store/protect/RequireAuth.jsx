import React from "react";
import { useAuth } from "./useAuth.jsx";
import { Navigate } from "react-router-dom";

function RequireAuth({ children }) {
  const user = useAuth(); // Checks for user authentication
  if (!user.userInfo) {
    // Ensure it checks `userInfo` inside the `user` object
    return <Navigate to="/login" />;
  }
  return children;
}

export default RequireAuth;
