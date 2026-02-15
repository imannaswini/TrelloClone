import express from "express";
import protect from "../middleware/authMiddleware.js";
import Task from "../models/Task.js";

const router = express.Router();

console.log("✅ Member routes loaded");


// ✅ MEMBER DASHBOARD STATS
router.get("/dashboard", protect, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "User not found in token" });
    }

    const userId = req.user.id;

    console.log("👀 Dashboard userId:", userId);

    const assigned = await Task.countDocuments({
      assignedTo: userId,
    });

    const inProgress = await Task.countDocuments({
      assignedTo: userId,
      status: "progress",
    });

    const completed = await Task.countDocuments({
      assignedTo: userId,
      status: "completed",
    });

    res.json({
      assigned,
      inProgress,
      completed,
    });

  } catch (err) {
    console.error("🔥 Member Dashboard Error:", err);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
});


// ✅ MEMBER TASKS
router.get("/tasks", protect, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "User not found in token" });
    }

    const userId = req.user.id;

    console.log("👀 Tasks userId:", userId);

    const tasks = await Task.find({
      assignedTo: userId,
    })
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.json(tasks);

  } catch (err) {
    console.error("🔥 Member Tasks Error:", err);
    res.status(500).json({ message: "Failed to load tasks" });
  }
});

export default router;
