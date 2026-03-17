import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Design from "./pages/Design";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import DesginManagement from "./pages/DesginManagement";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import AdminHome from "./pages/AdminHome";
import UserManagement from "./pages/UserManagement";
import AllItems from "./pages/AllItems";
import Guidelines from "./pages/Guidelines";

function ProtectedRoute({ children }) {
  const isAuthenticated = Boolean(sessionStorage.getItem("userId"));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/design/:id?"
            element={
              <ProtectedRoute>
                <Design />
              </ProtectedRoute>
            }
          />
          <Route
            path="/designManagement"
            element={
              <ProtectedRoute>
                <DesginManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/passwordreset/:resetToken"
            element={<ResetPassword />}
          />
          <Route path="/adminHome" element={<AdminHome />} />
          <Route path="/userManagement" element={<UserManagement />} />
          <Route path="/all-items" element={<AllItems />} />
          <Route path="/guidelines" element={<Guidelines />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
