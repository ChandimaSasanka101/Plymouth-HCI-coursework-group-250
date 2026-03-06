import express from "express";
import { getUserDetails, updateUser } from "../controller/profileController.js";
const router = express.Router();
router.get("/get/:id", getUserDetails);
router.post("/update/:id", updateUser);
export default router;
