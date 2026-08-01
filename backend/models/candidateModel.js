const { pool } = require("../config/db");

const CandidateModel = {
  async create(data) {
    const { name, email, phone, skills, experience, education, resume, created_by } = data;
    const [result] = await pool.query(
      `INSERT INTO candidates (name, email, phone, skills, experience, education, resume, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, skills, experience, education, resume, created_by]
    );
    return result.insertId;
  },

  async findAll({ search } = {}) {
    let query = "SELECT * FROM candidates";
    const params = [];
    if (search) {
      query += " WHERE name LIKE ? OR email LIKE ? OR skills LIKE ?";
      const like = `%${search}%`;
      params.push(like, like, like);
    }
    query += " ORDER BY created_at DESC";
    const [rows] = await pool.query(query, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM candidates WHERE id = ?", [id]);
    return rows[0] || null;
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    if (fields.length === 0) return false;
    values.push(id);
    const [result] = await pool.query(
      `UPDATE candidates SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await pool.query("DELETE FROM candidates WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};

module.exports = CandidateModel;
