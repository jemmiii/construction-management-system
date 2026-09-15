const express = require("express");
const router = express.Router();

const {
  createSite,
  getAllSites,
  getSiteById,
  updateSite,
} = require("../controllers/siteController");
const {
  authenticateAdmin,
} = require("../middleware/authMiddleware");
// Update Site
router.put("/:id", authenticateAdmin, updateSite);
// Get Single Site
router.get("/:id", authenticateAdmin, getSiteById);
// Create Site
router.post("/", authenticateAdmin, createSite);

// Get All Sites
router.get("/", authenticateAdmin, getAllSites);

module.exports = router;