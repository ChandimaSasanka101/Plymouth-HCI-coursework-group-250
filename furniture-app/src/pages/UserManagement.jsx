import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { UserManagementAPI } from "../services/userManagementAPI";
import TopNav from "../components/TopNav";
import "./UserManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Fetch Data
  const fetchUsers = async () => {
    try {
      const result = await UserManagementAPI.getAllUsers();
      console.log("Results from backend: ", result);
      if (result && result.success === false) {
        setError(result.message);
      } else {
        setUsers(result.users);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  //function to Ban a user
  const banAcc = async (Id) => {
    try {
      const response = await UserManagementAPI.BanUser(Id);
      if (response.success) {
        Swal.fire("Success", "User Banned successfully", "success");
        fetchUsers();
      } else {
        Swal.fire("Error", response.message || "Update Failed", "error");
      }
    } catch (error) {
      console.error("Update Error:", error);
      alert(`Error: ${error.message}`);
    }
  };
  //Function to unban a user
  const UnbanAcc = async (Id) => {
    try {
      const response = await UserManagementAPI.UnBanUser(Id);
      if (response.success) {
        Swal.fire("Success", "User Banned successfully", "success");
        fetchUsers();
      } else {
        Swal.fire("Error", response.message || "Update Failed", "error");
      }
    } catch (error) {
      console.error("Update Error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (loading) {
    return (
      <>
        <TopNav />
        <div className="user-management-page">
          <div className="user-management-state">Loading users...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <TopNav />
        <div className="user-management-page">
          <div className="user-management-state user-management-error">
            Error: {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      <div id="userTable-container">
        <table id="userTable">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id || index}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.status}</td>
                  <td>
                    {user.status === "Active" ? (
                      // Show BAN button
                      <button
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          cursor: "pointer",
                        }}
                        onClick={() => banAcc(user._id)}
                      >
                        Ban
                      </button>
                    ) : (
                      //User is Banned
                      <button
                        style={{
                          backgroundColor: "green",
                          color: "white",
                          cursor: "pointer",
                        }}
                        onClick={() => UnbanAcc(user._id)}
                      >
                        Unban
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;
