const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
  getRecentAttendance,
  getSiteWorkerCounts,
  getWorkerStatusSummary,
} = require("../controllers/dashboardController");

const {
  authenticateAdmin,
} = require("../middleware/authMiddleware");

// Dashboard Statistics
router.get("/", authenticateAdmin, getDashboardStats);

// Recent Attendance
router.get(
  "/recent-attendance",
  authenticateAdmin,
  getRecentAttendance
);

// Site-wise Active Worker Counts
router.get(
  "/site-worker-counts",
  authenticateAdmin,
  getSiteWorkerCounts
);

// Worker Status Summary
router.get(
  "/worker-status-summary",
  authenticateAdmin,
  getWorkerStatusSummary
);

module.exports = router;