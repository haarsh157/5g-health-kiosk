import express from "express";
import { getTemperature } from "../controllers/tempController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getTemperature);

export default router;
