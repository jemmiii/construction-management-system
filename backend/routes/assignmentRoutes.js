const express = require("express");
const router = express.Router();

const {
  assignWorkerToSite,
  getAllAssignments,
  unassignWorkerFromSite,
} = require("../controllers/assignmentController");

const {
  authenticateAdmin,
} = require("../middleware/authMiddleware");

// Assign worker to site
router.post("/", authenticateAdmin, assignWorkerToSite);

// Get all assignments
router.get("/", authenticateAdmin, getAllAssignments);

// Unassign worker from site
router.put("/:id/unassign", authenticateAdmin, unassignWorkerFromSite);

module.exports = router;