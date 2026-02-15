import express from "express";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

console.log("✅ User routes loaded");

// ✅ GET ALL USERS
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ✅ GET PENDING USERS
router.get("/pending", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find({ status: "pending" }).select("-password");
    res.json(users);
  } catch {
    res.status(500).json({ message: "Failed to fetch pending users" });
  }
});

// ✅ APPROVE USER
router.put("/:id/approve", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = "approved";
    await user.save();

    res.json({ message: "User approved successfully" });
  } catch {
    res.status(500).json({ message: "Approval failed" });
  }
});

// ✅ REJECT USER (optional)
router.delete("/:id/reject", protect, authorize("admin"), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User rejected & removed" });
  } catch {
    res.status(500).json({ message: "Rejection failed" });
  }
});

export default router;
