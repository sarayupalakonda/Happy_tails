const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");
const {
  createContact,
  getAdminContacts,
  deleteContact
} = require("../controllers/contactController");

router.post("/", createContact);
router.get("/admin", protect, isAdmin, getAdminContacts);
router.delete("/admin/:id", protect, isAdmin, deleteContact);

module.exports = router;
