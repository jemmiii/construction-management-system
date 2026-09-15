const express = require("express");
const router = express.Router();

const {
  createWorker,
  getAllWorkers,
  getWorkerById,
  updateWorker,
  registerWorker,
} = require("../controllers/workerController");
const {
  authenticateAdmin,
} = require("../middleware/authMiddleware");
// Worker self registration
router.post("/register", registerWorker);
// Update Worker
router.put("/:id", authenticateAdmin, updateWorker);
// Get Single Worker
router.get("/:id", authenticateAdmin, getWorkerById);
// Create Worker
router.post("/", authenticateAdmin, createWorker);

// Get All Workers
router.get("/", authenticateAdmin, getAllWorkers);

module.exports = router;