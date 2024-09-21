import React from "react";
import { useAdminAuth } from "./useAuth.jsx";
import { Navigate } from "react-router-dom";

function RequireAdminAuth({ children }) {
  const { adminInfo } = useAdminAuth(); // Destructuring adminInfo safely
  if (!adminInfo) {
    return <Navigate to={"/admin"} />;
  }
  return children;
}

export default RequireAdminAuth;
