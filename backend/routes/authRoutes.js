import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();


// ✅ REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const normalizedRole = role?.toLowerCase() || "member"; // ✅ FIX

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: normalizedRole,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("🔥 REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});


// ✅ LOGIN
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ FIX role comparison
    if (role && role.toLowerCase() !== user.role.toLowerCase()) {
      return res.status(403).json({ message: "Role mismatch" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("🔥 LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
