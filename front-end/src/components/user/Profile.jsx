import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/Slices/authSlice";
import axiosInstance from "../../config/axiosConfig";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.auth?.userInfo?.user);
  const userId = user?._id;
  // console.log("user", user);

  function FileNameExtractor(imgPath) {
    const fullPath = imgPath;
    const filename = fullPath.split("/").pop();

    return filename;
  }

  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axiosInstance.get(`/api/users/${userId}`);
        setUserData(response.data);
        setProfileImage(FileNameExtractor(response.data.profileImage)); // Construct the image URL
      } catch (error) {
        console.error("Error fetching profile image:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileImage();
  }, []);

  // Handle the logout action
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/users/logout");
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Handle the edit profile action
  const handleEditProfile = () => {
    navigate(`/profile/edit-profile/${userId}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 p-6">
      <div className="max-w-sm w-full bg-white rounded-lg shadow-md p-6 space-y-6 text-center">
        {/* Profile Picture */}
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : profileImage ? (
            <img
              src={`http://localhost:4040/uploads/${profileImage}`}
              alt="Profile"
              className="w-36 h-36 rounded-full mx-auto"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto"></div> // Placeholder if no profile picture
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {userData?.name}!
        </h1>
        <p className="text-gray-600">
          We're glad to have you back. Explore your profile or logout if you're
          done.
        </p>
        <div className="space-y-4">
          <button
            onClick={handleEditProfile}
            className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
