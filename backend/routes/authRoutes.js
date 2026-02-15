import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

console.log("✅ Auth routes loaded");

// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRole = role === "admin" ? "admin" : "member";

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: userRole,
      status: userRole === "admin" ? "approved" : "pending",
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ ADMIN → Auto login
    if (userRole === "admin") {
      return res.status(201).json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      });
    }

    // ✅ MEMBER → No token yet
    res.status(201).json({
      message: "Registration successful. Awaiting admin approval ⏳",
    });

  } catch (err) {
    console.error("🔥 Register Error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter email & password" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Block pending MEMBERS only
    if (user.role === "member" && user.status === "pending") {
      return res.status(403).json({
        message: "Account pending admin approval ⏳",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });

  } catch (err) {
    console.error("🔥 Login Error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;
