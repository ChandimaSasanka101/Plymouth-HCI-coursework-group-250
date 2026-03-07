import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Design from "./pages/Design";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import DesginManagement from "./pages/DesginManagement";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import AdminHome from "./pages/AdminHome";
import UserManagement from "./pages/UserManagement";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/design" element={<Design />} />
          <Route path="/designManagement" element={<DesginManagement />} />
          <Route path="/design/:id?" element={<Design />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/passwordreset/:resetToken"
            element={<ResetPassword />}
          />
          <Route path="/adminHome" element={<AdminHome />} />
          <Route path="/userManagement" element={<UserManagement />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
