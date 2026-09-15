const pool = require("../config/db");

// Assign Worker to Site
const assignWorkerToSite = async (req, res) => {
  try {
    const { worker_id, site_id, assigned_date } = req.body;

    // Validation
    if (!worker_id || !site_id) {
      return res.status(400).json({
        success: false,
        message: "Worker ID and Site ID are required",
      });
    }

    // Check worker exists
    const workerResult = await pool.query(
      "SELECT id, name, is_active FROM workers WHERE id = $1",
      [worker_id]
    );

    if (workerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    // Check worker is active
    if (!workerResult.rows[0].is_active) {
      return res.status(400).json({
        success: false,
        message: "Worker is inactive",
      });
    }

    // Check site exists
    const siteResult = await pool.query(
      "SELECT id, name, is_active FROM sites WHERE id = $1",
      [site_id]
    );

    if (siteResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
      });
    }

    // Check site is active
    if (!siteResult.rows[0].is_active) {
      return res.status(400).json({
        success: false,
        message: "Site is inactive",
      });
    }

    // Check if worker already has an active site assignment
    const existingAssignment = await pool.query(
      `SELECT id
       FROM worker_site_assignments
       WHERE worker_id = $1
       AND is_active = TRUE`,
      [worker_id]
    );

    if (existingAssignment.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Worker is already assigned to an active site",
      });
    }

    // Create assignment
    const result = await pool.query(
      `INSERT INTO worker_site_assignments (
        worker_id,
        site_id,
        assigned_date
      )
      VALUES ($1, $2, $3)
      RETURNING *`,
      [
        worker_id,
        site_id,
        assigned_date || new Date().toISOString().split("T")[0],
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Worker assigned to site successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Assign worker error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// Get All Active Assignments
const getAllAssignments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        wsa.id AS assignment_id,
        w.id AS worker_id,
        w.employee_id,
        w.name AS worker_name,
        w.phone,
        s.id AS site_id,
        s.name AS site_name,
        s.address AS site_address,
        wsa.assigned_date,
        wsa.unassigned_date,
        wsa.is_active
      FROM worker_site_assignments wsa
      JOIN workers w ON wsa.worker_id = w.id
      JOIN sites s ON wsa.site_id = s.id
      ORDER BY wsa.id DESC
    `);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get assignments error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// Unassign Worker from Site
const unassignWorkerFromSite = async (req, res) => {
  try {
    const { id } = req.params;

    // Check assignment exists
    const assignmentResult = await pool.query(
      `SELECT * FROM worker_site_assignments
       WHERE id = $1 AND is_active = TRUE`,
      [id]
    );

    if (assignmentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Active assignment not found",
      });
    }

    // Close assignment
    const result = await pool.query(
      `UPDATE worker_site_assignments
       SET
         is_active = FALSE,
         unassigned_date = CURRENT_DATE,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Worker unassigned successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Unassign worker error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
module.exports = {
  assignWorkerToSite,
  getAllAssignments,
  unassignWorkerFromSite,
};