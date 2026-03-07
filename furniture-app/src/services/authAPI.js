import axios from "axios";
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const PasswordRest = {
  forgotPassword: async (email) => {
    try {
      const response = await API.post("/auth/forgotpassword", { email });
      return response.data;
    } catch (error) {
      console.error("Save Error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Network Error: Is the server running?",
      };
    }
  },
};
export default PasswordRest;
