import React, { useReducer, useState } from "react";
import axiosInstance from "../../config/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAdminInfo } from "../../store/Slices/adminAuthSlice";

const initialState = {
  email: "",
  password: "",
};

const SET_EMAIL = "SET_EMAIL";
const SET_PASSWORD = "SET PASSWORD";
const RESET = "RESET";

const reducer = (state, action) => {
  switch (action.type) {
    case SET_EMAIL:
      return {
        ...state,
        email: action.payload,
      };
    case SET_PASSWORD:
      return {
        ...state,
        password: action.payload,
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
};

const AdminLogin = () => {
  const dispatchStore = useDispatch();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  const [errors, setErrors] = useState({});

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  const validate = () => {
    const newErrors = {};

    // Check if email is present and valid
    if (!state.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(state.email)) {
      newErrors.email = "Email is not valid";
    }

    // Password validation
    if (!state.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(state.password)) {
      newErrors.password =
        "Password must be at least 8 characters long, include one digit, one special character, and one capital letter";
    }

    setErrors(newErrors);
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSumit = async (e) => {
    e.preventDefault();
    try {
      if (validate()) {
        const response = await axiosInstance.post("/api/admin/login", state);
        console.log(response.data);
        const { _id, name, email } = response.data;
        dispatchStore(setAdminInfo({ admin: { _id, name, email } }));
        dispatch({ type: RESET });
        navigate("/admin/dashboard");
      }
    } catch (error) {
      if (error.status === 401) {
        setErrors((prevErr) => ({
          ...prevErr,
          inValid: error.response.data.message,
        }));
      }
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <div className="flex flex-col items-center justify-center w-1/3 bg-gray-800 p-8">
        <h1 className="text-3xl font-bold mb-4">Admin Portal</h1>
        <p className="mb-8 text-gray-400">Sign in to manage your dashboard</p>
      </div>
      <div className="flex flex-col justify-center  w-2/3 p-12">
        <div className="max-w-md ml-96">
          {/* Increased width here */}
          <h2 className="text-2xl font-semibold mb-3">Admin Login</h2>
          {errors.inValid && (
            <div className="mt-1 text-base text-red-600 mb-3">
              {errors.inValid}
            </div>
          )}
          <form onSubmit={handleSumit}>
            <div className="mb-4">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="username"
              >
                Email
              </label>
              <input
                type="text"
                id="username"
                value={state.email}
                onChange={(e) =>
                  dispatch({
                    type: SET_EMAIL,
                    payload: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-700 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
              {errors.email && (
                <div className="mt-1 text-sm text-red-600">{errors.email}</div>
              )}
            </div>
            <div className="mb-6">
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={state.password}
                onChange={(e) =>
                  dispatch({
                    type: SET_PASSWORD,
                    payload: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-700 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
              {errors.password && (
                <div className="mt-1 text-sm text-red-600">
                  {errors.password}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
