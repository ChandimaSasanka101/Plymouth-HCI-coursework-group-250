import React, { useEffect, useState } from 'react'
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

import RegisterAPI from "../services/RegisterAPI"


function Register() {
    const [userFirstName, setUserFirstName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const [userEamil, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    //Create user account 
    const createUserAcc = async (e) =>{
      e.preventDefault(); 
      //Check Password 
      if(userPassword !== confirmPassword){
        Swal.fire("Error", "Password Incorrect", "error")
        return;
      }
      const userData = {
        userFirstName,
        userLastName,
        userEamil,
        userPassword
      };
      try{
        const response = await RegisterAPI.createUser(userData);
        if(response.success){
          Swal.fire("Success", "Account created successfully", "success");
        }else{
          Swal.fire("Error", response.message || "Failed", "error");
        }
      }
      catch (error) {
        console.error("Update Error:", error);
        alert(`Error: ${error.message}`);

      }
    }


  return (
    <div>
      <form onSubmit={createUserAcc}>
        <label>First Name</label>
        <input type='text' value={userFirstName} onChange={(e) => setUserFirstName(e.target.value)} placeholder='FirstName' required />
        <label>Last Name</label>
        <input type='text' value={userLastName} onChange={(e) => setUserLastName(e.target.value)} placeholder='LastName' required/>
        <label>Email</label>
        <input type='email' value={userEamil} onChange={(e) => setUserEmail(e.target.value)} placeholder='user@gmail.com' required />
        <label>Password</label>
        <input type='password' value={userPassword} onChange={(e) => setUserPassword(e.target.value)} placeholder='password' required />
        <label>Confirm Password</label>
        <input type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default Register
