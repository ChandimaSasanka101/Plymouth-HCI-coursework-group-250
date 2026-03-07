import express from "express";
import {
  getAllUsers,
  BanUser,
  UnBanUser,
  getUserStats,
} from "../controller/userManagementController.js";
const router = express.Router();
router.get("/get", getAllUsers);
router.post("/banUser/:id", BanUser);
router.post("/unBanUser/:id", UnBanUser);
export default router;
