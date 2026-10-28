import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getPublicResults,
  getMonthlyHistory,
  getAdminResults,
  replaceLocationResults,
  deleteResult,
} from "../controllers/resultController.js";

const router = express.Router();

// Public endpoints never expose waiting numbers.
router.get("/current", getPublicResults);
router.get("/history", getMonthlyHistory);

// Protected admin endpoints
router.get("/admin", authMiddleware, getAdminResults);
router.post("/admin/location/:locationId", authMiddleware, replaceLocationResults);
router.delete("/admin/:id", authMiddleware, deleteResult);

export default router;