import dotenv from "dotenv";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import Admin from "./models/Admin.js";

async function seedAdmin() {
  try {
    const username = process.env.ADMIN_USERNAME?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password || password === "replace_this_with_a_strong_password") {
      throw new Error("Set ADMIN_USERNAME and a strong ADMIN_PASSWORD in backend/.env first.");
    }
    if (password.length < 12) {
      throw new Error("ADMIN_PASSWORD must be at least 12 characters long.");
    }

    await connectDB();
    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await Admin.findOneAndUpdate(
      { username },
      { $set: { password: hashedPassword, role: "admin" } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    console.log(`Admin account ready for username: ${admin.username}`);
  } catch (error) {
    console.error("Admin seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

seedAdmin();