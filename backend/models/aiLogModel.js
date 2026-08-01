const { pool } = require("../config/db");

const AiLogModel = {
  async create({ candidate_id, summary, match_score }) {
    const [result] = await pool.query(
      "INSERT INTO ai_logs (candidate_id, summary, match_score) VALUES (?, ?, ?)",
      [candidate_id || null, summary || null, match_score || null]
    );
    return result.insertId;
  },
};

module.exports = AiLogModel;
