import { useSelector } from "react-redux";

export const useAuth = () => {
  const userInfo = useSelector((state) => state.auth.userInfo); // Accessing userInfo directly
  return { userInfo }; // Return the expected object shape
};

export const useAdminAuth = () => {
  const adminInfo = useSelector((state) => state.adminAuth.adminInfo);
  console.log("adminInfo", adminInfo);
  return { adminInfo: adminInfo || null }; // Ensure adminInfo is never undefined
};
