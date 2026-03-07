import express from "express";
import {
  getAllUsers,
  BanUser,
  UnBanUser,
  getUserStats,
} from "../controller/userManagementController.js";
const router = express.Router();
export default router;
