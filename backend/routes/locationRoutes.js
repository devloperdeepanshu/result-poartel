import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getLocations,
  createLocation,
  deleteLocation,
} from "../controllers/locationController.js";

const router = express.Router();

// Public list of active locations
router.get("/", getLocations);

// Admin-only location management
router.post("/", authMiddleware, createLocation);
router.delete("/:id", authMiddleware, deleteLocation);

export default router;