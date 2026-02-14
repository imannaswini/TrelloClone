import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

import User from "./models/User.js";
import Project from "./models/Project.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

console.log("🔥 Backend server running with project routes");

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

// ✅ ADMIN DASHBOARD
app.get("/api/admin/dashboard", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments({ status: "active" });
    const pendingApprovals = await Project.countDocuments({ status: "pending" });

    res.json({
      totalUsers,
      totalProjects,
      pendingApprovals,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
});

// ✅ ROOT
app.get("/", (req, res) => {
  res.send("SPARK Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
