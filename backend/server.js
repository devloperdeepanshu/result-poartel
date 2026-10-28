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

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
}));
app.use(express.json({ limit: "20kb" }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Results Portal API is running.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/results", resultRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "API route not found." });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ success: false, message: "Invalid JSON request body." });
  }
  console.error("Unhandled server error:", error.message);
  return res.status(500).json({ success: false, message: "Internal server error." });
});

async function startServer() {
  try {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 10) {
      throw new Error("Set JWT_SECRET to a random secret of at least 10 characters in backend/.env");
    }

    await connectDB();

    // Process due schedules on startup and periodically while the server is running.
    await publishDueResults();
    const scheduler = setInterval(() => {
      publishDueResults().catch((error) => {
        console.error("Scheduled result publishing failed:", error.message);
      });
    }, 15_000);
    scheduler.unref();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();