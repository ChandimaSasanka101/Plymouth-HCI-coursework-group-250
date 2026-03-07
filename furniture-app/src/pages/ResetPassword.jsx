import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { resetToken } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return Swal.fire("Error", "Passwords do not match", "error");
    }

    try {
      //send the PUT request to your BACKEND route

      const response = await axios.put(
        `http://localhost:5000/api/auth/resetpassword/${resetToken}`,
        { password },
      );

      if (response.data.success) {
        Swal.fire("Success", "Password Reset Successfully", "success").then(
          () => {
            navigate("/");
          },
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Invalid Token",
        "error",
      );
    }
  };

  return (
    <div className="reset-container">
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;
