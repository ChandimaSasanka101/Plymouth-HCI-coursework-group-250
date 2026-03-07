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
router.get("/get/:id", getDesign);
export default router;
