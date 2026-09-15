const pool = require("../config/db");

// Create Worker
const createWorker = async (req, res) => {
  try {
    const {
      employee_id,
      name,
      phone,
      email,
      password,
      daily_wage,
      monthly_salary,
      salary_type,
      joining_date,
    } = req.body;

    // Required fields validation
    if (!employee_id || !name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Employee ID, name, phone and password are required",
      });
    }

    // Check duplicate Employee ID
    const existingWorker = await pool.query(
      "SELECT id FROM workers WHERE employee_id = $1",
      [employee_id]
    );

    if (existingWorker.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Worker already exists with this Employee ID",
      });
    }

    // Check duplicate phone
    const existingPhone = await pool.query(
      "SELECT id FROM workers WHERE phone = $1",
      [phone]
    );

    if (existingPhone.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Worker already exists with this phone number",
      });
    }

    // Create Worker
    const result = await pool.query(
      `INSERT INTO workers (
        employee_id,
        name,
        phone,
        email,
        password,
        daily_wage,
        monthly_salary,
        salary_type,
        joining_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, employee_id, name, phone, email,
                daily_wage, monthly_salary, salary_type,
                joining_date, is_active, created_at`,
      [
        employee_id,
        name,
        phone,
        email || null,
        password,
        daily_wage || 0,
        monthly_salary || 0,
        salary_type || "daily",
        joining_date || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Worker created successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Create worker error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// Get All Workers
const getAllWorkers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        employee_id,
        name,
        phone,
        email,
        profile_photo,
        joining_date,
        daily_wage,
        monthly_salary,
        salary_type,
        is_active,
        created_at
      FROM workers
      ORDER BY id DESC
    `);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });

  } catch (error) {
    console.error("Get workers error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// Get Single Worker
const getWorkerById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
        id,
        employee_id,
        name,
        phone,
        email,
        profile_photo,
        face_data,
        joining_date,
        daily_wage,
        monthly_salary,
        salary_type,
        is_active,
        created_at,
        updated_at
      FROM workers
      WHERE id = $1`,
      [id]
    );

    // Worker not found
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Get worker error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// Update Worker
const updateWorker = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      phone,
      email,
      daily_wage,
      monthly_salary,
      salary_type,
      joining_date,
      is_active,
    } = req.body;

    // Check worker exists
    const existingWorker = await pool.query(
      "SELECT id FROM workers WHERE id = $1",
      [id]
    );

    if (existingWorker.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    // Update worker
    const result = await pool.query(
      `UPDATE workers
       SET
         name = COALESCE($1, name),
         phone = COALESCE($2, phone),
         email = COALESCE($3, email),
         daily_wage = COALESCE($4, daily_wage),
         monthly_salary = COALESCE($5, monthly_salary),
         salary_type = COALESCE($6, salary_type),
         joining_date = COALESCE($7, joining_date),
         is_active = COALESCE($8, is_active),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING
         id,
         employee_id,
         name,
         phone,
         email,
         daily_wage,
         monthly_salary,
         salary_type,
         joining_date,
         is_active,
         updated_at`,
      [
        name ?? null,
        phone ?? null,
        email ?? null,
        daily_wage ?? null,
        monthly_salary ?? null,
        salary_type ?? null,
        joining_date ?? null,
        is_active ?? null,
        id,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Worker updated successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Update worker error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// Register Worker from Worker App

const registerWorker = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      name,
      email,
      phone,
      password,
      site_id,
    } = req.body;

    // Required fields
    if (!name || !email || !phone || !password || !site_id) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, phone, password and site are required",
      });
    }

    await client.query("BEGIN");

    // Check duplicate phone
    const existingPhone = await client.query(
      "SELECT id FROM workers WHERE phone = $1",
      [phone]
    );

    if (existingPhone.rows.length > 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Worker already exists with this phone number",
      });
    }

    // Check duplicate email
    const existingEmail = await client.query(
      "SELECT id FROM workers WHERE email = $1",
      [email]
    );

    if (existingEmail.rows.length > 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Worker already exists with this email",
      });
    }

    // Check selected site
    const siteResult = await client.query(
      `SELECT id, name, is_active
       FROM sites
       WHERE id = $1`,
      [site_id]
    );

    if (siteResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Selected site not found",
      });
    }

    // Site must be active
    if (!siteResult.rows[0].is_active) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Selected site is inactive",
      });
    }

    // Generate Employee ID automatically
    const employeeResult = await client.query(`
      SELECT employee_id
      FROM workers
      WHERE employee_id LIKE 'WRK%'
      ORDER BY id DESC
      LIMIT 1
    `);

    let nextNumber = 1;

    if (employeeResult.rows.length > 0) {
      const lastEmployeeId =
        employeeResult.rows[0].employee_id;

      const lastNumber = parseInt(
        lastEmployeeId.replace("WRK", ""),
        10
      );

      if (!Number.isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    const employee_id = `WRK${String(
      nextNumber
    ).padStart(3, "0")}`;

    // Create worker
    const workerResult = await client.query(
      `INSERT INTO workers (
        employee_id,
        name,
        phone,
        email,
        password
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        employee_id,
        name,
        phone,
        email,
        is_active,
        created_at`,
      [
        employee_id,
        name,
        phone,
        email,
        password,
      ]
    );

    const worker = workerResult.rows[0];

    // Automatically assign worker to selected site
    const assignmentResult = await client.query(
      `INSERT INTO worker_site_assignments (
        worker_id,
        site_id,
        assigned_date,
        is_active
      )
      VALUES ($1, $2, CURRENT_DATE, TRUE)
      RETURNING
        id,
        worker_id,
        site_id,
        assigned_date,
        is_active`,
      [
        worker.id,
        site_id,
      ]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Worker registered successfully",
      data: {
        worker,
        assignment: assignmentResult.rows[0],
        site: siteResult.rows[0],
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Register worker error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  } finally {
    client.release();
  }
};
module.exports = {
  createWorker,
  getAllWorkers,
  getWorkerById,
  updateWorker,
  registerWorker,
};