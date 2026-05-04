const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");
const { 
  getAllAdoptions, 
  updateAdoptionStatus, 
  getStats,
  getAllUsers 
} = require("../controllers/adminController");

// All routes here are protected and require admin role
router.use(protect);
router.use(isAdmin);

router.get("/adoptions", getAllAdoptions);
router.put("/adoptions/:id", updateAdoptionStatus);
router.get("/stats", getStats);
router.get("/users", getAllUsers);

module.exports = router;
