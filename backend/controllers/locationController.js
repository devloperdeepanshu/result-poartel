import mongoose from "mongoose";
import Location from "../models/Location.js";
import Result from "../models/Result.js";

async function getLocations(req, res) {
  try {
    const locations = await Location.find({ isActive: true }).sort({ name: 1 }).lean();
    return res.json({ success: true, locations });
  } catch (error) {
    console.error("Get locations error:", error.message);
    return res.status(500).json({ success: false, message: "Could not load locations." });
  }
}

async function createLocation(req, res) {
  try {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    if (!name || name.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Location name is required and must be at most 100 characters.",
      });
    }

    const existing = await Location.findOne({ name: { $regex: `^${escapeRegex(name)}$`, $options: "i" } });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
        return res.status(200).json({ success: true, message: "Location restored.", location: existing });
      }
      return res.status(409).json({ success: false, message: "This location already exists." });
    }

    const location = await Location.create({ name });
    return res.status(201).json({ success: true, message: "Location added.", location });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "This location already exists." });
    }
    console.error("Create location error:", error.message);
    return res.status(500).json({ success: false, message: "Could not create location." });
  }
}

async function deleteLocation(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid location ID." });
    }

    const location = await Location.findById(req.params.id);
    if (!location || !location.isActive) {
      return res.status(404).json({ success: false, message: "Location not found." });
    }

    // Soft-delete the location so historical results remain available.
    location.isActive = false;
    await location.save();

    // Hide all active results from public views, while preserving history.
    await Result.updateMany(
      { location: location._id, status: { $in: ["waiting", "published"] } },
      { $set: { status: "expired" } }
    );

    return res.json({ success: true, message: "Location deleted; history retained." });
  } catch (error) {
    console.error("Delete location error:", error.message);
    return res.status(500).json({ success: false, message: "Could not delete location." });
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export { getLocations, createLocation, deleteLocation };