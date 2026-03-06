import axios from "axios";
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const loginUser = async (userData) => {
  const response = await API.post("/login", userData);
  return response.data;
};
