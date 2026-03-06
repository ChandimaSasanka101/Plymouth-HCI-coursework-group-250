import axios from "axios";
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const RegisterAPI = {
  createUser: async (userData) => {
    try {
      const response = await API.post("/register/create", userData);
      return { success: true };
    } catch (error) {
      console.error("Get Service Error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Network Error: Is the server running?",
      };
    }
  },
};

export default RegisterAPI;
