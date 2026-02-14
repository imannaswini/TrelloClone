import express from "express";
import Project from "../models/Project.js";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

console.log("✅ Project routes loaded");

// ✅ GET PROJECTS
router.get("/", protect, async (req, res) => {
  const projects = await Project.find()
    .populate("members", "name email role")
    .sort({ createdAt: -1 });

  res.json(projects);
});

// ✅ CREATE PROJECT
router.post("/", protect, authorize("admin"), async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Project name required" });
  }

  const project = await Project.create({
    name,
    createdBy: req.user.id,
    status: "active",
  });

  res.status(201).json(project);
});

// ✅ DELETE PROJECT
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Project deleted" });
});

export default router;
