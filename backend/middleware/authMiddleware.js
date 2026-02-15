import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Normalize user object
    req.user = {
      id: decoded.id || decoded._id,   // 🔥 Handles both cases
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("🔥 Token Error:", error.message);
    return res.status(401).json({ message: "Token invalid" });
  }
};

export default protect;
