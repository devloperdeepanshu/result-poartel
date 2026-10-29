import dotenv from "dotenv";
dotenv.config();

import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import publishDueResults from "./utils/publishDueResults.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://result-update-tmuy.onrender.com",
];

// CORS configuration — must come before API routes
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("CORS blocked origin:", origin);
      return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  })
);

// Handle JSON requests
app.use(express.json({ limit: "20kb" }));

// API health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Results Portal API is running.",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/results", resultRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body.",
    });
  }

  if (error.message === "Origin not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "Origin not allowed by CORS.",
    });
  }

  console.error("Unhandled server error:", error.message);

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

// Start server
async function startServer() {
  try {
    if (
      !process.env.JWT_SECRET ||
      process.env.JWT_SECRET.length < 10
    ) {
      throw new Error(
        "Set JWT_SECRET to a random secret of at least 10 characters."
      );
    }

    await connectDB();

    // Process scheduled results on startup
    await publishDueResults();

    // Process scheduled results periodically
    const scheduler = setInterval(() => {
      publishDueResults().catch((error) => {
        console.error(
          "Scheduled result publishing failed:",
          error.message
        );
      });
    }, 15000);

    scheduler.unref();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Allowed frontend origins:", allowedOrigins);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();