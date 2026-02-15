import express from "express";
import Task from "../models/Task.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

console.log("✅ Member routes loaded");

// ✅ MEMBER STATS
router.get("/stats", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const assigned = await Task.countDocuments({
      assignedTo: userId,
    });

    const inProgress = await Task.countDocuments({
      assignedTo: userId,
      status: "progress",
    });

    const completed = await Task.countDocuments({
      assignedTo: userId,
      status: "done",
    });

    res.json({
      assigned,
      inProgress,
      completed,
    });
  } catch (err) {
    console.error("Member Stats Error:", err);
    res.status(500).json({ message: "Failed to load stats" });
  }
});

export default router;
