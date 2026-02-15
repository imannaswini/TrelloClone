import express from "express";
import Board from "../models/Board.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

console.log("✅ Board routes loaded");

// ✅ GET BOARD BY PROJECT
router.get("/:projectId", protect, async (req, res) => {
  try {
    let board = await Board.findOne({ projectId: req.params.projectId });

    if (!board) {
      board = await Board.create({
        projectId: req.params.projectId,
        lists: [
          { title: "To Do", cards: [] },
          { title: "In Progress", cards: [] },
          { title: "Completed", cards: [] },
        ],
      });
    }

    res.json(board);
  } catch (error) {
    console.error("Get Board Error:", error);
    res.status(500).json({ message: "Failed to load board" });
  }
});

// ✅ UPDATE BOARD
router.put("/:projectId", protect, async (req, res) => {
  try {
    const { lists } = req.body;

    const board = await Board.findOneAndUpdate(
      { projectId: req.params.projectId },
      { lists },
      { new: true }
    );

    res.json(board);
  } catch (error) {
    console.error("Update Board Error:", error);
    res.status(500).json({ message: "Failed to update board" });
  }
});

export default router;
