import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UserDetailAPI from "../services/ProfileAPI";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userEamil, setUserEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const storedUserId = sessionStorage.getItem("userId");
  //Get user data
  const GetUserDetails = async () => {
    if (!storedUserId) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to continue.",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Go to Login",
      }).then(async () => {
        window.location.href = "./Login.jsx";
      });
    }
    try {
      const response = await UserDetailAPI.getUserDetails(storedUserId);
      if (response.success) {
        setUserFirstName(response.firstName);
        setUserLastName(response.lastName);
        setUserEmail(response.email);
        setOriginalData({
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
        });
      } else {
        alert("Error in getting user data");
      }
    } catch (err) {
      console.error("Failed to load userData", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    GetUserDetails();
  }, []);
  const handleEditClick = () => {
    setIsEditing(true);
  };

  //update user function
  const handleSubmit = async (e) => {
    console.log("Edit user function hit");
    e.preventDefault();
    try {
      if (
        userFirstName === originalData.firstName &&
        userLastName === originalData.lastName
      ) {
        Swal.fire(
          "No Changes Detected",
          "Please change at least one field before saving.",
          "warning",
        );
        return;
      }
      const newData = {
        userFirstName,
        userLastName,
      };
      const response = await UserDetailAPI.updateUser(storedUserId, newData);
      if (response.success) {
        Swal.fire("Success", "User updated successfully", "success");
        setIsEditing(false);
      } else {
        Swal.fire("Error", response.message || "Update Failed", "error");
      }
    } catch (error) {
      console.error("Update Error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  //cancel btn function
  const handleCancel = (e) => {
    e.preventDefault();
    setUserFirstName(originalData.firstName);
    setUserLastName(originalData.lastName);
    setUserEmail(originalData.email);
    setIsEditing(false);
  };
  if (loading) return <p>Loading...</p>;
  //handleBackBtn
  const handleBackBtn = async () => {
    navigate("/home");
  };

  return (
    <div id="main-div">
      <div>
        <button className="back-btn" onClick={handleBackBtn}>
          ← Back
        </button>
      </div>
      <div>
        <button onClick={handleEditClick}>Edit</button>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <label>First Name</label>
          <input
            type="text"
            value={userFirstName}
            onChange={(e) => setUserFirstName(e.target.value)}
            placeholder="FirstName"
            required
            readOnly={!isEditing}
          />
          <label>Last Name</label>
          <input
            type="text"
            value={userLastName}
            onChange={(e) => setUserLastName(e.target.value)}
            placeholder="LastName"
            required
            readOnly={!isEditing}
          />
          <label>Email</label>
          <input
            type="email"
            value={userEamil}
            onChange={(e) => setUserEmail(e.target.value)}
            readOnly
            required
          />
          {isEditing && (
            <div className="button-group">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button type="submit" className="save-btn">
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Profile;
