import React, { useEffect, useState } from "react";
import DesignAPI from "../services/DesignAPI";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", // Responsive grid
    gap: "20px",
    padding: "20px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    backgroundColor: "white",
    transition: "transform 0.2s",
    cursor: "pointer",
  },
  imagePlaceholder: {
    width: "100%",
    height: "150px",
    backgroundColor: "#eee",
    borderRadius: "4px",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#888",
  },
};
function DesginManagement() {
  const [desgins, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  //Get data
  const fetchUserDesigns = async () => {
    const storedUserId = sessionStorage.getItem("userId");
    if (!storedUserId) {
      alert("Please log in to View your design!");
      return;
    }
    const response = await DesignAPI.getDesign(storedUserId);
    if (response.success) {
      setDesigns(response.data);
    } else {
      alert(response.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchUserDesigns();
  }, []);
  //Delete button function
  const handleDeleteBtnClick = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      //call API
      const response = await DesignAPI.deleteDesign(id);
      if (response.success) {
        Swal.fire({
          title: "Deleted!",
          text: "The Designs has been Deleted.",
          icon: "success",
        });
        fetchUserDesigns();
      } else {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong.",
          icon: "error",
        });
      }
    });
  };

  const handleEditBtnClick = async (id) => {
    navigate(`/design/${id}`);
  };
  const filteredDesigns = desgins.filter((design) =>
    design.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  if (loading) return <div>Loading designs...</div>;
  return (
    <div id="main-div">
      <h2>My Saved Designs</h2>
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search designs by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>
      <div id="designs" style={styles.grid}>
        {filteredDesigns.length === 0 ? (
          <p style={{ padding: "20px" }}>
            {searchTerm
              ? `No designs found matching "${searchTerm}"`
              : "No designs found. Create one!"}
          </p>
        ) : (
          // Loop through filteredDesigns instead of all designs
          filteredDesigns.map((design) => (
            <div key={design._id} style={styles.card}>
              <h3 style={{ margin: "0 0 10px 0" }}>{design.name}</h3>
              <p style={{ fontSize: "14px", color: "#666" }}>
                Created: {new Date(design.createdAt).toLocaleDateString()}
              </p>
              <p style={{ fontSize: "12px" }}>
                Items: {design.items ? design.items.length : 0} furniture pieces
              </p>
              <button
                style={{ marginRight: "10px", cursor: "pointer" }}
                onClick={() => handleEditBtnClick(design._id)}
              >
                Edit
              </button>
              <button
                style={{ cursor: "pointer", color: "red" }}
                onClick={() => handleDeleteBtnClick(design._id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DesginManagement;
