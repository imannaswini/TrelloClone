import express from "express";
import User from "../models/User.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
