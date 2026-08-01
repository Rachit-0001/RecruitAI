const { pool } = require("../config/db");

const InterviewModel = {
  async create({ application_id, interview_date, interviewer, result }) {
    const [res] = await pool.query(
      `INSERT INTO interviews (application_id, interview_date, interviewer, result)
       VALUES (?, ?, ?, ?)`,
      [application_id, interview_date, interviewer, result || "pending"]
    );
    return res.insertId;
  },

  async findAll() {
    const [rows] = await pool.query(
      `SELECT i.*, a.candidate_id, a.job_id, c.name AS candidate_name, j.title AS job_title
       FROM interviews i
       JOIN applications a ON i.application_id = a.id
       JOIN candidates c ON a.candidate_id = c.id
       JOIN jobs j ON a.job_id = j.id
       ORDER BY i.interview_date DESC`
    );
    return rows;
  },

  async countTotal() {
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM interviews");
    return rows[0].total;
  },
};

module.exports = InterviewModel;
