import React, { useEffect, useRef, useState } from "react";
import DesignAPI from "../services/DesignAPI";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import './DesignManagement.css';

function DesginManagement() {
  const [desgins, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const mainRef = useRef(null);
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

  useEffect(() => {
    if (!mainRef.current) return;

    const revealElements = mainRef.current.querySelectorAll('.dm-scroll-reveal:not(.visible)');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [loading, filteredDesigns.length]);

  return (
    <>
      <TopNav />

      <div id="main-div" ref={mainRef}>
        <h2 className="dm-scroll-reveal">My Saved Designs</h2>
        <div className="dm-scroll-reveal" style={{ transitionDelay: '0.08s' }}>
          <input
            type="text"
            placeholder="Search designs by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div id="designs">
          {loading ? (
            <p className="dm-scroll-reveal" style={{ transitionDelay: '0.16s' }}>Loading designs...</p>
          ) : filteredDesigns.length === 0 ? (
            <p className="dm-scroll-reveal" style={{ transitionDelay: '0.16s' }}>
              {searchTerm
                ? `No designs found matching "${searchTerm}"`
                : "No designs found. Create one!"}
            </p>
          ) : (
            filteredDesigns.map((design, index) => (
              <div key={design._id} className="dm-scroll-reveal" style={{ transitionDelay: `${0.12 + Math.min(index * 0.06, 0.36)}s` }}>
                <h3>{design.name}</h3>
                <p>
                  Created: {new Date(design.createdAt).toLocaleDateString()}
                </p>
                <p>
                  Items: {design.items ? design.items.length : 0} furniture pieces
                </p>
                <button
                  onClick={() => handleEditBtnClick(design._id)}>
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBtnClick(design._id)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default DesginManagement;
