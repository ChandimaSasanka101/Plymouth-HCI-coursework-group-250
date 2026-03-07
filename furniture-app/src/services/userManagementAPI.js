import axios from "axios";
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const UserManagementAPI = {
  getAllUsers: async () => {
    try {
      const response = await API.get("/userManagement/get");
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
  BanUser: async (Id) => {
    try {
      const response = await API.post(`/userManagement/banUser/${Id}`);
      return { success: true };
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
  UnBanUser: async (Id) => {
    try {
      const response = await API.post(`/userManagement/unBanUser/${Id}`);
      return { success: true };
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
  getUserStats: async () => {
    try {
      const response = await API.get("/userManagement/stats");
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

export default UserManagementAPI;
