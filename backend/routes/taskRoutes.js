import express from "express";
import Task from "../models/Task.js";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

console.log("✅ Task routes loaded");


// ✅ CREATE TASK (Admin)
router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    const { title, projectId, assignedTo } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const task = await Task.create({
      title,
      project: projectId,
      assignedTo: assignedTo || null,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Create Task Error:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
});


// ✅ GET ALL TASKS (Admin Dashboard)
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("project", "name")
      .populate("assignedTo", "name email");

    res.json(tasks);
  } catch (err) {
    console.error("Fetch Tasks Error:", err);
    res.status(500).json({ message: "Failed to load tasks" });
  }
});


// ✅ GET TASKS BY PROJECT
router.get("/project/:projectId", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignedTo", "name email");

    res.json(tasks);
  } catch (err) {
    console.error("Project Tasks Error:", err);
    res.status(500).json({ message: "Failed to load tasks" });
  }
});


// ✅ UPDATE TASK (Status / Assigned Member)
router.put("/:id", protect, async (req, res) => {
  try {
    const { status, assignedTo } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (status) task.status = status;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;

    await task.save();

    res.json(task);
  } catch (err) {
    console.error("Update Task Error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});


// ✅ DELETE TASK (Admin)
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    console.log("🗑 Deleting task:", req.params.id);

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete Task Error:", err);
    res.status(500).json({ message: "Failed to delete task" });
  }
});

export default router;
