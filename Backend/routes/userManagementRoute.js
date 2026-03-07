import express from "express";
import {
  getAllUsers,
  BanUser,
  UnBanUser,
  getUserStats,
} from "../controller/userManagementController.js";
const router = express.Router();
router.get("/get", getAllUsers);
export default router;
