const { pool } = require("../config/db");

const ApplicationModel = {
  async create({ candidate_id, job_id, status }) {
    const [result] = await pool.query(
      `INSERT INTO applications (candidate_id, job_id, status) VALUES (?, ?, ?)`,
      [candidate_id, job_id, status || "applied"]
    );
    return result.insertId;
  },

  async findAll() {
    const [rows] = await pool.query(
      `SELECT a.*, c.name AS candidate_name, c.email AS candidate_email,
              j.title AS job_title
       FROM applications a
       JOIN candidates c ON a.candidate_id = c.id
       JOIN jobs j ON a.job_id = j.id
       ORDER BY a.created_at DESC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM applications WHERE id = ?", [id]);
    return rows[0] || null;
  },

  async updateStatus(id, status) {
    const [result] = await pool.query(
      "UPDATE applications SET status = ? WHERE id = ?",
      [status, id]
    );
    return result.affectedRows > 0;
  },

  async countByStatus() {
    const [rows] = await pool.query(
      "SELECT status, COUNT(*) AS count FROM applications GROUP BY status"
    );
    return rows;
  },

  async countTotal() {
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM applications");
    return rows[0].total;
  },

  async perMonth() {
    const [rows] = await pool.query(
      `SELECT DATE_FORMAT(applied_date, '%Y-%m') AS month, COUNT(*) AS count
       FROM applications GROUP BY month ORDER BY month`
    );
    return rows;
  },
};

module.exports = ApplicationModel;
