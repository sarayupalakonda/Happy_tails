const express = require("express");
const router = express.Router();
const dogController = require("../controllers/dogController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Public routes
router.get("/", dogController.getDogs);
router.get("/:id", dogController.getDog);

// Admin-only routes
router.post("/admin", protect, isAdmin, dogController.addDog);
router.put("/admin/:id", protect, isAdmin, dogController.updateDog);
router.delete("/admin/:id", protect, isAdmin, dogController.deleteDog);

// Legacy routes (keeping to avoid breaking existing frontend logic if any)
router.post("/", protect, isAdmin, dogController.addDog);
router.put("/:id", protect, isAdmin, dogController.updateDog);
router.delete("/:id", protect, isAdmin, dogController.deleteDog);

module.exports = router;