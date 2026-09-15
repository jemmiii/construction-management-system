const pool = require("../config/db");

// Mark Attendance
const markAttendance = async (req, res) => {
  try {
    const {
      worker_id,
      site_id,
      attendance_date,
      status,
    } = req.body;

    // Check required fields
    if (!worker_id || !site_id || !attendance_date || !status) {
      return res.status(400).json({
        success: false,
        message:
          "worker_id, site_id, attendance_date and status are required",
      });
    }

    // Check worker exists
    const workerResult = await pool.query(
      "SELECT id FROM workers WHERE id = $1",
      [worker_id]
    );

    if (workerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    // Check site exists
    const siteResult = await pool.query(
      "SELECT id FROM sites WHERE id = $1",
      [site_id]
    );

    if (siteResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
      });
    }

    // Check duplicate attendance
    const existingAttendance = await pool.query(
      `SELECT id FROM attendance
       WHERE worker_id = $1
       AND attendance_date = $2`,
      [worker_id, attendance_date]
    );

    if (existingAttendance.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this date",
      });
    }

    // Create attendance
    const result = await pool.query(
      `INSERT INTO attendance (
        worker_id,
        site_id,
        attendance_date,
        status
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [
        worker_id,
        site_id,
        attendance_date,
        status,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Mark attendance error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
const getAllAttendance = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        attendance.*,
        workers.name AS worker_name,
        workers.employee_id,
        sites.name AS site_name
      FROM attendance
      JOIN workers ON attendance.worker_id = workers.id
      JOIN sites ON attendance.site_id = sites.id
      ORDER BY attendance.attendance_date DESC
    `);

    res.status(200).json({
      success: true,
      message: "Attendance records fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Get attendance error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// Get Attendance History of a Single Worker
const getWorkerAttendance = async (req, res) => {
  try {
    const { worker_id } = req.params;

    // Check worker exists
    const workerResult = await pool.query(
      "SELECT id, name, employee_id FROM workers WHERE id = $1",
      [worker_id]
    );

    if (workerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    // Get attendance history
    const attendanceResult = await pool.query(
      `SELECT
        attendance.id,
        attendance.attendance_date,
        attendance.status,
        sites.id AS site_id,
        sites.name AS site_name
      FROM attendance
      JOIN sites ON attendance.site_id = sites.id
      WHERE attendance.worker_id = $1
      ORDER BY attendance.attendance_date DESC`,
      [worker_id]
    );

    return res.status(200).json({
      success: true,
      worker: workerResult.rows[0],
      count: attendanceResult.rows.length,
      data: attendanceResult.rows,
    });

  } catch (error) {
    console.error("Get worker attendance error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// Get Attendance Summary of a Worker
const getWorkerAttendanceSummary = async (req, res) => {
  try {
    const { worker_id } = req.params;

    // Check worker exists
    const workerResult = await pool.query(
      "SELECT id, name, employee_id FROM workers WHERE id = $1",
      [worker_id]
    );

    if (workerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    // Get attendance summary
    const summaryResult = await pool.query(
      `SELECT
        COUNT(*) AS total_days,
        COUNT(*) FILTER (WHERE status = 'present') AS present_days,
        COUNT(*) FILTER (WHERE status = 'absent') AS absent_days,
        COUNT(*) FILTER (WHERE status = 'half_day') AS half_days
      FROM attendance
      WHERE worker_id = $1`,
      [worker_id]
    );

    return res.status(200).json({
      success: true,
      worker: workerResult.rows[0],
      summary: summaryResult.rows[0],
    });

  } catch (error) {
    console.error("Get attendance summary error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// Get Attendance Summary of a Single Site
const getSiteAttendanceSummary = async (req, res) => {
  try {
    const { site_id } = req.params;

    // Check site exists
    const siteResult = await pool.query(
      "SELECT id, name FROM sites WHERE id = $1",
      [site_id]
    );

    if (siteResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
      });
    }

    // Get attendance summary
    const summaryResult = await pool.query(
      `SELECT
        COUNT(*) AS total_days,
        COUNT(*) FILTER (WHERE status = 'present') AS present_days,
        COUNT(*) FILTER (WHERE status = 'absent') AS absent_days,
        COUNT(*) FILTER (WHERE status = 'half_day') AS half_days
      FROM attendance
      WHERE site_id = $1`,
      [site_id]
    );

    return res.status(200).json({
      success: true,
      site: siteResult.rows[0],
      summary: summaryResult.rows[0],
    });
  } catch (error) {
    console.error("Get site attendance summary error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
module.exports = {
  markAttendance,
  getAllAttendance,
  getWorkerAttendance,
  getWorkerAttendanceSummary,
  getSiteAttendanceSummary,
};