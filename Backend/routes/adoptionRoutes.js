const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createRequest } = require("../controllers/adoptionController");
const { getAllAdoptions, updateAdoptionStatus, deleteAdoption } = require("../controllers/adminController");
const { isAdmin } = require("../middleware/authMiddleware");

// Public route
router.post("/", protect, createRequest);

// Admin routes required by user spec
router.get("/admin", protect, isAdmin, getAllAdoptions);
router.patch("/admin/:id/status", protect, isAdmin, updateAdoptionStatus);
router.delete("/admin/:id", protect, isAdmin, deleteAdoption);

module.exports = router;
