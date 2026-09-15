const express = require("express");

const router = express.Router();

const {
  markAttendance,
  getAllAttendance,
  getWorkerAttendance,
  getWorkerAttendanceSummary,
  getSiteAttendanceSummary,
} = require("../controllers/attendanceController");
const {
  authenticateAdmin,
} = require("../middleware/authMiddleware");

// Mark Attendance
router.post("/", authenticateAdmin, markAttendance);

// Get All Attendance
router.get("/", authenticateAdmin, getAllAttendance);

// Get Attendance History of a Single Worker

// Get Attendance History of a Single Worker
router.get(
  "/worker/:worker_id",
  authenticateAdmin,
  getWorkerAttendance
);

// Get Attendance Summary of a Single Worker
router.get(
  "/worker/:worker_id/summary",
  authenticateAdmin,
  getWorkerAttendanceSummary
);
// Get Attendance Summary of a Single Site
router.get(
  "/site/:site_id/summary",
  authenticateAdmin,
  getSiteAttendanceSummary
);

module.exports = router;