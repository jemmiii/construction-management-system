const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./config/db");

const adminRoutes = require("./routes/adminRoutes");
const workerRoutes = require("./routes/workerRoutes");
const siteRoutes = require("./routes/siteRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

dotenv.config();

const app = express();

// Middleware MUST come first
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/sites", siteRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
// Basic API
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Construction Management System API is running 🚀",
  });
});

// Database test
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT current_database(), NOW()"
    );

    res.json({
      success: true,
      message: "Database connected successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});