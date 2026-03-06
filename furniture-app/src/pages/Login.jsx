import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/LoginAPI";
import { PasswordRest } from "../services/authAPI";

function Login() {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const logIn = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const data = await loginUser({ userEmail, userPassword });
      console.log("User ID:", data._id);
      sessionStorage.setItem("userId", data._id);
      Swal.fire("Success", "Login Successful", "success");
      if (data.type === "Customer") {
        navigate("/home");
      }
    } catch (error) {
      //Error handling
      if (error.response && error.response.data) {
        //show "User not found" or "Invalid Password"
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };
  const goToRegister = () => {
    navigate("/register");
  };
  //handleforgotpassword
  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Reset Password",
      input: "email",
      inputLabel: "Enter your email address",
      inputPlaceholder: "user@example.com",
      showCancelButton: true,
      confirmButtonText: "Send Reset Link",
      showLoaderOnConfirm: true,
      //preConfirm handles the async API call
      preConfirm: async (email) => {
        try {
          // Call the API
          const response = await PasswordRest.forgotPassword(email);
          return response;
        } catch (error) {
          Swal.showValidationMessage(
            `Request failed: ${error.response?.data?.error || "User not found"}`,
          );
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    // If the API call was successful, show success message
    if (email) {
      Swal.fire({
        title: "Email Sent!",
        text: "Check your inbox for the password reset link.",
        icon: "success",
      });
    }
  };
  return (
    <div>
      <h2>Welcome</h2>
      <form onSubmit={logIn}>
        <label>Email</label>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="User@gmail.com"
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
          placeholder="password"
          required
        />
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button type="submit">Login</button>
      </form>
      <div>
        <a
          onClick={handleForgotPassword}
          style={{
            cursor: "pointer",
            color: "blue",
            textDecoration: "underline",
          }}
        >
          Forgot Password
        </a>
      </div>
      <div>
        <p> Don't have an account?</p>
        <button onClick={goToRegister}>Register</button>
      </div>
    </div>
  );
}

export default Login;
