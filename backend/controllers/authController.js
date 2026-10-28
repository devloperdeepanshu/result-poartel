import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

async function loginAdmin(req, res) {
  try {
    const { username, password } = req.body ?? {};

    if (typeof username !== "string" || typeof password !== "string" ||
        !username.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const admin = await Admin.findOne({
      username: username.trim().toLowerCase(),
    }).select("+password");

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET must be configured with at least 32 characters.",
      });
    }

    const token = jwt.sign(
      { id: admin._id.toString(), role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export { loginAdmin };