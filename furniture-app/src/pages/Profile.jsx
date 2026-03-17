import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UserDetailAPI from "../services/ProfileAPI";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import "./Profile.css";

function Profile({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const storedUserId = sessionStorage.getItem("userId");

  const getUserDetails = async () => {
    if (!storedUserId) {
      await Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to continue.",
        confirmButtonColor: "#C1B7B8",
        background: "#1a1a1a",
        color: "#DED2D3",
      });
      onClose();
      return;
    }

    try {
      setLoading(true);
      const response = await UserDetailAPI.getUserDetails(storedUserId);
      if (response.success) {
        setUserFirstName(response.firstName || "");
        setUserLastName(response.lastName || "");
        setUserEmail(response.email || "");
        setOriginalData({
          firstName: response.firstName || "",
          lastName: response.lastName || "",
          email: response.email || "",
        });
      } else {
        Swal.fire("Error", "Failed to load user data.", "error");
      }
    } catch (err) {
      console.error("Failed to load user data", err);
      Swal.fire("Error", "Something went wrong while loading profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    getUserDetails();
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!originalData) return;
    if (
      userFirstName === originalData.firstName &&
      userLastName === originalData.lastName
    ) {
      Swal.fire(
        "No Changes Detected",
        "Please change at least one field before saving.",
        "warning"
      );
      return;
    }

    try {
      const newData = {
        firstName: userFirstName,
        lastName: userLastName,
      };
      const response = await UserDetailAPI.updateUser(storedUserId, newData);

      if (response.success) {
        Swal.fire("Success", "User updated successfully", "success");
        setOriginalData({
          firstName: userFirstName,
          lastName: userLastName,
          email: userEmail,
        });
        setIsEditing(false);
      } else {
        Swal.fire("Error", response.message || "Update failed", "error");
      }
    } catch (error) {
      console.error("Update Error:", error);
      Swal.fire("Error", error.message || "Update failed", "error");
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    if (!originalData) return;
    setUserFirstName(originalData.firstName);
    setUserLastName(originalData.lastName);
    setUserEmail(originalData.email);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "You will need to login again to continue.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#8b0000",
      background: "#1a1a1a",
      color: "#DED2D3",
    });

    if (!result.isConfirmed) return;

    sessionStorage.removeItem("userId");
    onClose();
    navigate("/", { replace: true });
  };

  if (!isOpen) return null;

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="profile-close-btn" onClick={onClose} aria-label="Close profile">
          <FaTimes />
        </button>

        <h2 className="profile-title">MY PROFILE</h2>
        <p className="profile-subtitle">Manage your account details</p>

        {loading ? (
          <p className="profile-loading">Loading profile...</p>
        ) : (
          <form className="profile-form" onSubmit={handleSubmit}>
            <label>First Name</label>
            <input
              type="text"
              value={userFirstName}
              onChange={(e) => setUserFirstName(e.target.value)}
              placeholder="First Name"
              required
              readOnly={!isEditing}
            />

            <label>Last Name</label>
            <input
              type="text"
              value={userLastName}
              onChange={(e) => setUserLastName(e.target.value)}
              placeholder="Last Name"
              required
              readOnly={!isEditing}
            />

            <label>Email</label>
            <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} readOnly required />

            {!isEditing ? (
              <>
                <button type="button" className="profile-main-btn" onClick={handleEditClick}>
                  Edit Profile
                </button>
                <button type="button" className="profile-logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <div className="profile-button-group">
                <button type="button" className="profile-cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="profile-save-btn">
                  Save Changes
                </button>
              </div>
            )}

            {isEditing && (
              <button type="button" className="profile-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;