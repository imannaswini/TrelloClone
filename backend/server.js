import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

import User from "./models/User.js";
import Project from "./models/Project.js";
import Task from "./models/Task.js";

import protect from "./middleware/authMiddleware.js";
import authorize from "./middleware/roleMiddleware.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

console.log("🔥 Backend server running");

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/board", boardRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/tasks", taskRoutes);

// ✅ ADMIN DASHBOARD
app.get(
  "/api/admin/dashboard",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalProjects = await Project.countDocuments({ status: "active" });
      const pendingApprovals = await User.countDocuments({
        status: "pending",
      });
      const totalTasks = await Task.countDocuments();

      res.json({
        totalUsers,
        totalProjects,
        pendingApprovals,
        totalTasks,
      });
    } catch (error) {
      console.error("Dashboard Stats Error:", error);
      res.status(500).json({ message: "Failed to load dashboard stats" });
    }
  }
);

// ✅ ROOT
app.get("/", (req, res) => {
  res.send("SPARK Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
