import axios from "axios";
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const DesignAPI = {
  createDesign: async (designData) => {
    try {
      const response = await API.post("/design/create", designData);
      return {
        success: true,
        data: response.data,
      };
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

  getDesign: async (Id) => {
    try {
      const response = await API.get(`/design/get/${Id}`);
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
  deleteDesign: async (Id) => {
    try {
      const response = await API.post(`/design/delete/${Id}`);
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
  seletedDesign: async (Id) => {
    try {
      const response = await API.get(`/design/selected/${Id}`);
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
export default DesignAPI;
