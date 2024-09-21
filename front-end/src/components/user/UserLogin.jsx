import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/Slices/authSlice";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Regular expression for email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  // Function to validate form inputs
  const validate = () => {
    const newErrors = {};

    // Check if email is present and valid
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    try {
      if (validate()) {
        // Form is valid, proceed with submission
        console.log("formData : ", formData);
        const response = await axiosInstance.post("/api/users/auth", formData);
        console.log("response : ", response);
        const { _id, name, email } = response.data;
        dispatch(setCredentials({ user: { _id, name, email } }));
        navigate("/profile");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrors((prevErr) => ({
          ...prevErr,
          invalidCredentials: error.response.data.message,
        }));
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        {errors.invalidCredentials && (
          <div className="mt-3 text-base text-center text-red-600">
            {errors.invalidCredentials}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Form field for email */}
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <div className="mt-1 text-sm text-red-600">{errors.email}</div>
            )}
          </div>

          {/* Form field for password */}
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <div className="mt-1 text-sm text-red-600">{errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
          <button
            type="button"
            className="w-full py-2 text-black rounded hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => navigate("/")}
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
