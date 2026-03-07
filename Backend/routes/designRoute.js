import express from "express";
import {
  createDesign,
  getDesign,
  deleteDesign,
  seletedDesign,
  updateDesign,
} from "../controller/designController.js";
const router = express.Router();
router.post("/create", createDesign);
export default router;
