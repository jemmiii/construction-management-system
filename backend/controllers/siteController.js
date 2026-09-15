const pool = require("../config/db");

// Create Site
const createSite = async (req, res) => {
  try {
    const {
      name,
      address,
      latitude,
      longitude,
      allowed_radius,
      contact_person,
      contact_phone,
    } = req.body;

    // Validation
    if (!name || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Name, latitude and longitude are required",
      });
    }

    // Create site
    const result = await pool.query(
      `INSERT INTO sites (
        name,
        address,
        latitude,
        longitude,
        allowed_radius,
        contact_person,
        contact_phone
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        name,
        address || null,
        latitude,
        longitude,
        allowed_radius || 200,
        contact_person || null,
        contact_phone || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Site created successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Create site error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// Get All Sites
const getAllSites = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM sites
       ORDER BY id DESC`
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });

  } catch (error) {
    console.error("Get sites error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// Get Single Site
const getSiteById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM sites
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Get site error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// Update Site
const updateSite = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      address,
      latitude,
      longitude,
      allowed_radius,
      contact_person,
      contact_phone,
      is_active,
    } = req.body;

    // Check site exists
    const existingSite = await pool.query(
      "SELECT id FROM sites WHERE id = $1",
      [id]
    );

    if (existingSite.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
      });
    }

    // Update site
    const result = await pool.query(
      `UPDATE sites
       SET
         name = COALESCE($1, name),
         address = COALESCE($2, address),
         latitude = COALESCE($3, latitude),
         longitude = COALESCE($4, longitude),
         allowed_radius = COALESCE($5, allowed_radius),
         contact_person = COALESCE($6, contact_person),
         contact_phone = COALESCE($7, contact_phone),
         is_active = COALESCE($8, is_active),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [
        name ?? null,
        address ?? null,
        latitude ?? null,
        longitude ?? null,
        allowed_radius ?? null,
        contact_person ?? null,
        contact_phone ?? null,
        is_active ?? null,
        id,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Site updated successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Update site error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
module.exports = {
  createSite,
  getAllSites,
  getSiteById,
  updateSite,
};