const jwt = require("jsonwebtoken");

/**
 * Protect routes - User must be logged in
 */
const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.headers.authorization) {
    token = req.headers.authorization;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔑 Decoded Token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Token Verification Error:", error.message);
    return res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};

/**
 * Admin access only (with deep fallback)
 */
const isAdmin = async (req, res, next) => {
  console.log("👮 Checking Admin Role. User object from token:", req.user);
  
  try {
    const User = require("../models/User");
    const user = await User.findById(req.user.id);

    if (!user) {
        console.warn("🚫 User not found in database for ID:", req.user.id);
        return res.status(403).json({ success: false, message: "Access denied. User not found." });
    }

    // Check 1: Database Role
    if (user.role === "admin") {
      console.log("✅ Admin verified via Database.");
      req.user.role = "admin"; // Ensure role is available for next handlers
      return next();
    }

    // Check 2: Emergency Email Fallback (Hardcoded for initial setup)
    if (user.email === "admin@happytails.com") {
      console.log("⚠️ Emergency Override: admin@happytails.com verified as Admin.");
      user.role = "admin";
      await user.save();
      req.user.role = "admin";
      return next();
    }

    console.warn("🚫 Access Denied. User found but not an admin. Role:", user.role);
    res.status(403).json({ success: false, message: "Access denied. Admin only." });

  } catch (error) {
    console.error("❌ isAdmin Middleware Error:", error.message);
    res.status(500).json({ success: false, message: "Server error during auth check" });
  }
};

module.exports = { protect, isAdmin };