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
router.post("/delete/:id", deleteDesign);
router.get("/selected/:id", seletedDesign);
export default router;
