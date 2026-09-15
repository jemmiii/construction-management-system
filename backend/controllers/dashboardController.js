const pool = require("../config/db");

// Get Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    // Total workers
    const totalWorkersResult = await pool.query(
      "SELECT COUNT(*) AS total_workers FROM workers"
    );

    // Active workers
    const activeWorkersResult = await pool.query(
      "SELECT COUNT(*) AS active_workers FROM workers WHERE is_active = TRUE"
    );

    // Total sites
    const totalSitesResult = await pool.query(
      "SELECT COUNT(*) AS total_sites FROM sites"
    );

    // Active sites
    const activeSitesResult = await pool.query(
      "SELECT COUNT(*) AS active_sites FROM sites WHERE is_active = TRUE"
    );

    // Active assignments
    const assignmentsResult = await pool.query(
      "SELECT COUNT(*) AS total_assignments FROM worker_site_assignments WHERE is_active = TRUE"
    );

    // Today's present attendance
    const todayPresentResult = await pool.query(`
      SELECT COUNT(*) AS today_present
      FROM attendance
      WHERE attendance_date = CURRENT_DATE
      AND status = 'present'
    `);

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      data: {
        total_workers: totalWorkersResult.rows[0].total_workers,
        active_workers: activeWorkersResult.rows[0].active_workers,
        total_sites: totalSitesResult.rows[0].total_sites,
        active_sites: activeSitesResult.rows[0].active_sites,
        total_assignments: assignmentsResult.rows[0].total_assignments,
        today_present: todayPresentResult.rows[0].today_present,
      },
    });

  } catch (error) {
    console.error("Dashboard stats error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// Get Recent Attendance
const getRecentAttendance = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        attendance.id,
        attendance.attendance_date,
        attendance.status,
        workers.name AS worker_name,
        workers.employee_id,
        sites.name AS site_name
      FROM attendance
      JOIN workers ON attendance.worker_id = workers.id
      JOIN sites ON attendance.site_id = sites.id
      ORDER BY attendance.attendance_date DESC, attendance.id DESC
      LIMIT 10
    `);

    return res.status(200).json({
      success: true,
      message: "Recent attendance fetched successfully",
      count: result.rows.length,
      data: result.rows,
    });

  } catch (error) {
    console.error("Recent attendance error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// Get Site-wise Active Worker Counts
const getSiteWorkerCounts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        s.id AS site_id,
        s.name AS site_name,
        s.address,
        s.is_active,
        COUNT(wsa.id) AS active_worker_count
      FROM sites s
      LEFT JOIN worker_site_assignments wsa
        ON s.id = wsa.site_id
        AND wsa.is_active = TRUE
      GROUP BY s.id, s.name, s.address, s.is_active
      ORDER BY s.id DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Site worker counts fetched successfully",
      data: result.rows,
    });

  } catch (error) {
    console.error("Site worker counts error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// Get Worker Status Summary
const getWorkerStatusSummary = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) AS total_workers,

        COUNT(*) FILTER (
          WHERE is_active = TRUE
        ) AS active_workers,

        COUNT(*) FILTER (
          WHERE is_active = FALSE
        ) AS inactive_workers,

        COUNT(*) FILTER (
          WHERE is_active = TRUE
          AND id IN (
            SELECT worker_id
            FROM worker_site_assignments
            WHERE is_active = TRUE
          )
        ) AS assigned_workers,

        COUNT(*) FILTER (
          WHERE is_active = TRUE
          AND id NOT IN (
            SELECT worker_id
            FROM worker_site_assignments
            WHERE is_active = TRUE
          )
        ) AS unassigned_workers

      FROM workers
    `);

    return res.status(200).json({
      success: true,
      message: "Worker status summary fetched successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Worker status summary error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


module.exports = {
  getDashboardStats,
  getRecentAttendance,
  getSiteWorkerCounts,
  getWorkerStatusSummary,
};