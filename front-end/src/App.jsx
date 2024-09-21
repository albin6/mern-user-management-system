import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./components/user/Profile";
import RequireAuth from "./store/protect/RequireAuth";
import SignUpForm from "./components/user/UserSignup";
import LoginForm from "./components/user/UserLogin";
import RequireAuthForLogin from "./store/protect/RequireAuthForLogin";
import EditProfile from "./components/user/EditProfile";
import NotFound from "./components/NotFound";
import AdminLogin from "./components/admin/AdminLogin";
import AdminPanel from "./components/admin/AdminPanel";
import RequireAdminAuth from "./store/protect/RequireAdminAuth";
import RequireAdminAuthForLogin from "./store/protect/RequireAdminAuthForLogin";
import EditUserProfile from "./components/admin/EditUserProfile";
import AddUser from "./components/admin/AddUser";

function AppLayout() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuthForLogin>
            <SignUpForm />
          </RequireAuthForLogin>
        }
      />
      <Route
        path="/login"
        element={
          <RequireAuthForLogin>
            <LoginForm />
          </RequireAuthForLogin>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />
      <Route
        path="/profile/edit-profile/:id"
        element={
          <RequireAuth>
            <EditProfile />
          </RequireAuth>
        }
      />
      <Route path="*" element={<NotFound />} />
      <Route
        path="/admin"
        element={
          <RequireAdminAuthForLogin>
            <AdminLogin />
          </RequireAdminAuthForLogin>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <RequireAdminAuth>
            <AdminPanel />
          </RequireAdminAuth>
        }
      />
      <Route
        path="/admin/edit-user-profile/:userId"
        element={<EditUserProfile />}
      />
      <Route path="/admin/add-user" element={<AddUser />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
