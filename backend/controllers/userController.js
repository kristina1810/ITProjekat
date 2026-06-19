const { poolPromise } = require("../db");

const getAllUsers = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT 
        users.id,
        users.first_name,
        users.last_name,
        users.email,
        users.phone,
        users.created_at,
        roles.name AS role
      FROM users
      JOIN roles ON users.role_id = roles.id
      ORDER BY users.created_at DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers
};