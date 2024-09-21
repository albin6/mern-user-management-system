// EditProfile.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";

const EditProfile = () => {
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const [formData, setFormData] = useState({
    id,
    name: "",
    email: "",
    profilePicture: null,
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/users/${id}`);
        console.log(response.data);
        setFormData((prevState) => ({
          ...prevState,
          name: response.data.name || "",
          email: response.data.email || "",
          profilePicture: null,
        }));
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchUserDetails();
  }, [id]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (!nameRegex.test(formData.name)) {
      newErrors.name = "Name should contain only alphabets";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email is not valid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long, include one digit, one special character, and one capital letter";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axiosInstance.put(
          "/api/users/profile",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.message) {
          return setMessage(response.data.message);
        }
        alert("Profile updated successfully");
        navigate("/profile");
      } catch (error) {
        if (error?.status === 400) {
          setMessage(error.response.data.message);
        } else {
          console.log(error);
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Edit Profile
        </h2>
        {message && (
          <div className="mt-1 text-base text-center text-red-600">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
            {errors.name && (
              <div className="mt-1 text-sm text-red-600">{errors.name}</div>
            )}
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <div className="mt-1 text-sm text-red-600">{errors.email}</div>
            )}
          </div>

          {/* Form field for password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              New Password:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.password && (
              <div className="mt-1 text-sm text-red-600">{errors.password}</div>
            )}
          </div>

          {/* Profile Picture Upload */}
          <div className="flex flex-col mb-4">
            <label
              htmlFor="image"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Upload Profile Image:
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="px-4 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.image && (
              <div className="mt-1 text-sm text-red-600">{errors.image}</div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>

        {/* Back Button */}
        <button
          onClick={() => navigate("/profile")}
          className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
