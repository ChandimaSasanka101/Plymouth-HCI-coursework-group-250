import express from "express";
import { forgotPassword, resetPassword } from "../controller/authController.js";

const router = express.Router();

// Route for requesting the email
router.post("/forgotpassword", forgotPassword);

// Route for resetting the password (token comes in URL)
router.put("/resetpassword/:resetToken", resetPassword);

export default router;
