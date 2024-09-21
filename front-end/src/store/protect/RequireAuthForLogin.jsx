import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth.jsx";

function RequireAuthForLogin({ children }) {
  const user = useAuth();
  if (user.userInfo) {
    return <Navigate to={"/profile"} />;
  }

  return children;
}

export default RequireAuthForLogin;
