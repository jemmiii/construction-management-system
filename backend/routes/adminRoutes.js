const express = require("express");
const router = express.Router();
const { authenticateAdmin } = require("../middleware/authMiddleware");

const {
  registerAdmin,
  loginAdmin,
} = require("../controllers/adminController");
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/profile", authenticateAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Protected route accessed successfully",
    admin: req.admin,
  });
});
module.exports = router;