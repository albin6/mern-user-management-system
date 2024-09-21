import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axiosConfig";
import { adminLogout } from "../../store/Slices/adminAuthSlice";
import { logout } from "../../store/Slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmationBox from "./ConfirmationBox";

const AdminPanel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/usersList");
        console.log(response.data);
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize filtered users with all users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (searchTerm === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter(
          (user) =>
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term)
        )
      );
    }
  };

  // Handle logout action
  const handleLogout = async () => {
    await axiosInstance.post("/api/admin/logout");
    dispatch(adminLogout());
    console.log("Logged out");
    navigate("/admin");
  };

  // Handle Edit Click
  const handleEditClick = (userId) => {
    console.log(userId);
    navigate(`/admin/edit-user-profile/${userId}`);
  };

  const confirmationPopUp = () => {
    return new Promise((res) =>
      setTimeout(() => {
        console.log("hold end");
        res();
      }, 5000)
    );
  };

  // Handle Delete Click
  const handleDeleteClick = async (userId) => {
    try {
      const response = await axiosInstance.delete(
        `/api/admin/deleteUser/${userId}`
      );
      dispatch(logout());
      setMessage(response.data.message);
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  const addNewUserClick = () => {
    try {
      navigate("/admin/add-user");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 shadow-md">
        <div className="p-4 border-b border-gray-700 h-20 flex items-center">
          <span className="text-2xl font-bold text-gray-200">Admin Panel</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <header className="flex items-center justify-between pb-4 border-b border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-200">Dashboard</h2>
          <div className="flex items-center">
            <button
              onClick={addNewUserClick}
              className="px-4 py-2 mr-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Add New
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Search Input */}
        <div className="mt-6 mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-600 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Users Table */}
        <section>
          <div className="flex justify-between">
            <span className="text-lg font-bold text-gray-200 mb-4">
              Registered Users
            </span>
            {message && (
              <span className="text-base text-green-400">{message}</span>
            )}
          </div>
          <div className="overflow-x-auto bg-gray-800 rounded shadow">
            <table className="w-full min-w-max">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-300">Name</th>
                  <th className="px-4 py-2 text-left text-gray-300">Email</th>
                  <th className="px-4 py-2 text-left text-gray-300">Role</th>
                  <th className="px-4 py-2 text-left text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-t border-gray-700">
                    <td className="px-4 py-2 text-gray-200">{user.name}</td>
                    <td className="px-4 py-2 text-gray-200">{user.email}</td>
                    <td className="px-4 py-2 text-gray-200">
                      {user.isAdmin ? "Admin" : "User"}
                    </td>
                    <td className="px-4 py-2 text-gray-200">
                      <button
                        onClick={() => handleEditClick(user._id)}
                        className="px-2 py-1 mr-2 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user._id)}
                        className="px-2 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminPanel;
