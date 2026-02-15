import express from "express";
import Project from "../models/Project.js";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

console.log("✅ Project routes loaded");

// ✅ GET ALL PROJECTS
router.get("/", protect, async (req, res) => {
  const projects = await Project.find()
    .populate("members", "name email role")
    .sort({ createdAt: -1 });

  res.json(projects);
});

// ✅ GET SINGLE PROJECT  ⭐ FIXED
router.get("/:id", protect, async (req, res) => {
  try {
    console.log("Fetching project:", req.params.id);

    const project = await Project.findById(req.params.id)
      .populate("members", "name email role");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    console.error("Single Project Error:", error);
    res.status(500).json({ message: "Server error" });
  }
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

// ✅ ADD MEMBER
router.put("/:id/members", protect, authorize("admin"), async (req, res) => {
  const { userId } = req.body;

  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (project.members.includes(userId)) {
    return res.status(400).json({ message: "User already a member" });
  }

  project.members.push(userId);
  await project.save();

  res.json({ message: "Member added", project });
});

// ✅ REMOVE MEMBER
router.delete("/:id/members/:userId", protect, authorize("admin"), async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  project.members = project.members.filter(
    (m) => m.toString() !== req.params.userId
  );

  await project.save();

  res.json({ message: "Member removed" });
});
// ✅ GET PENDING USERS (Admin only)
router.get("/pending", protect, authorize("admin"), async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: "pending" })
      .select("name email role createdAt");

    res.json(pendingUsers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ APPROVE USER
router.put("/:id/approve", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = "approved";
    user.role = "member"; // optional logic
    await user.save();

    res.json({ message: "User approved ✅" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ REJECT USER
router.delete("/:id/reject", protect, authorize("admin"), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User rejected ❌" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
