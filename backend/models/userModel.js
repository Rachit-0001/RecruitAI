const { pool } = require("../config/db");

const UserModel = {
  async create({ name, email, hashedPassword, role }) {
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role || "recruiter"]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  async findAll() {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    return rows;
  },
};

module.exports = UserModel;
