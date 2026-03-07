import express from "express";
import { forgotPassword, resetPassword } from "../controller/authController.js";

const router = express.Router();

// Route for requesting the email
router.post("/forgotpassword", forgotPassword);

export default router;
