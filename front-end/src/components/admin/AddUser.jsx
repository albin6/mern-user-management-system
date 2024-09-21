import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";

const SignUpForm = () => {
  const navigate = useNavigate();
  const initialFormData = {
    name: "",
    email: "",
    password: "",
    image: null,
  };

  const [formData, setFormData] = useState(initialFormData);

  const [errors, setErrors] = useState({});
  const [userExists, setUserExists] = useState("");

  // Regular expression for email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/;
  const nameRegex = /^[A-Za-z]+$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  // Function to validate form inputs
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

    // Image validation
    if (!formData.image) {
      newErrors.image = "Profile image is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (validate()) {
      // Form is valid, proceed with submission
      console.log("formData : ", formData);
      try {
        const response = await axiosInstance.post(
          "/api/users/register",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("responese : ", response);
        setErrors({});
        navigate("/admin/dashboard");
      } catch (error) {
        setErrors({});
        if (error.response && error.response.status === 409) {
          setUserExists(error.response.data.message);
        } else {
          console.log(error);
        }
      }

      // You can add your API call or further form processing here
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded shadow-lg shadow-slate-800">
        <h2 className="text-2xl font-bold text-center text-white">Add User</h2>
        {userExists && (
          <div className="mt-1 text-base text-center text-red-600">
            {userExists}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Form field for name */}
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="mb-1 text-sm font-medium text-white"
            >
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <div className="mt-1 text-sm text-red-600">{errors.name}</div>
            )}
          </div>

          {/* Form field for email */}
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-1 text-sm font-medium text-white"
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
              className="mb-1 text-sm font-medium text-white"
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

          {/* Form field for image upload */}
          <div className="flex flex-col">
            <label
              htmlFor="image"
              className="mb-1 text-sm font-medium text-white"
            >
              Upload Profile Image:
            </label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="px-4 py-2 border text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.image && (
              <div className="mt-1 text-sm text-red-600">{errors.image}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add User
          </button>
          <button
            type="button"
            className="w-full py-2 text-white hover:text-black rounded hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
