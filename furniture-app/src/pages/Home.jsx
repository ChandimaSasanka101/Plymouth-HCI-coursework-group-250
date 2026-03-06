import React from 'react'
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const goToDesgin = ()=>{
    navigate("/design")
  }
  const goToDesginManagement = ()=>{
    navigate("/designManagement")
  }
  const goToProfile = ()=>{
    navigate("/profile")
  }
  return (
    <div>
      <h2>Welcome</h2>
      <button onClick={goToDesgin}>Desgin Page</button>
      <button onClick={goToDesginManagement}>Design Management</button>
      <button onClick={goToProfile}>Profile</button>
    </div>
  )
}

export default Home
