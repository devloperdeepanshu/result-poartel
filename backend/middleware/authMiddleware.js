import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login first.",
      });
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    const admin = await Admin.findById(decoded.id).select("_id username role");
    if (!admin || admin.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Admin account not found or access denied.",
      });
    }

    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    });
  }
}

export default authMiddleware;