const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Admin
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Check if admin already exists
    const existingAdmin = await pool.query(
      "SELECT id FROM admins WHERE email = $1",
      [email]
    );

    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const result = await pool.query(
      `INSERT INTO admins (name, email, password, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, phone, role, is_active, created_at`,
      [name, email, hashedPassword, phone || null]
    );

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Register admin error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Login Admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find admin
    const result = await pool.query(
      "SELECT * FROM admins WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const admin = result.rows[0];

    // Check active status
    if (!admin.is_active) {
      return res.status(403).json({
        success: false,
        message: "Admin account is inactive",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
      },
    });

  } catch (error) {
    console.error("Login admin error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
};