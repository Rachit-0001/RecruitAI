// Run with: npm run seed
// Inserts sample users with properly bcrypt-hashed passwords, then jobs/candidates/applications/interviews.
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { pool, testConnection } = require("../config/db");

async function seed() {
  await testConnection();
  const hashedPassword = await bcrypt.hash("Password123", 10);

  const conn = await pool.getConnection();
  try {
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");
    await conn.query("TRUNCATE TABLE ai_logs");
    await conn.query("TRUNCATE TABLE interviews");
    await conn.query("TRUNCATE TABLE applications");
    await conn.query("TRUNCATE TABLE candidates");
    await conn.query("TRUNCATE TABLE jobs");
    await conn.query("TRUNCATE TABLE users");
    
    await conn.query("SET FOREIGN_KEY_CHECKS = 1");

    const [adminResult] = await conn.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      ["Admin User", "admin@recruitai.com", hashedPassword, "admin"]
    );
    const [recruiterResult] = await conn.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      ["Rachit Recruiter", "recruiter@recruitai.com", hashedPassword, "recruiter"]
    );

    const adminId = adminResult.insertId;
    const recruiterId = recruiterResult.insertId;

    const [job1] = await conn.query(
      `INSERT INTO jobs (title, description, required_skills, location, salary, status, created_by)
       VALUES ('Frontend Developer', 'Build responsive UIs using React.', 'React, JavaScript, CSS, Tailwind', 'Remote', '6-10 LPA', 'open', ?)`,
      [recruiterId]
    );
    const [job2] = await conn.query(
      `INSERT INTO jobs (title, description, required_skills, location, salary, status, created_by)
       VALUES ('Backend Developer', 'Design and maintain REST APIs.', 'Node.js, Express, MySQL', 'Bangalore', '8-12 LPA', 'open', ?)`,
      [recruiterId]
    );
    const [job3] = await conn.query(
      `INSERT INTO jobs (title, description, required_skills, location, salary, status, created_by)
       VALUES ('Full Stack Developer', 'End-to-end feature development.', 'React, Node.js, MySQL, AWS', 'Delhi', '10-15 LPA', 'open', ?)`,
      [adminId]
    );

    const [cand1] = await conn.query(
      `INSERT INTO candidates (name, email, phone, skills, experience, education, resume, created_by)
       VALUES ('Aarav Sharma', 'aarav.sharma@example.com', '9876543210', 'React, JavaScript, HTML, CSS', '2 years', 'B.Tech CSE', 'Experienced frontend developer skilled in React and modern JS.', ?)`,
      [recruiterId]
    );
    const [cand2] = await conn.query(
      `INSERT INTO candidates (name, email, phone, skills, experience, education, resume, created_by)
       VALUES ('Priya Verma', 'priya.verma@example.com', '9876500001', 'Node.js, Express, MySQL', '3 years', 'B.Tech IT', 'Backend engineer with strong API design experience.', ?)`,
      [recruiterId]
    );
    const [cand3] = await conn.query(
      `INSERT INTO candidates (name, email, phone, skills, experience, education, resume, created_by)
       VALUES ('Karan Mehta', 'karan.mehta@example.com', '9876500002', 'React, Node.js, MongoDB, AWS', '4 years', 'M.Tech CSE', 'Full stack developer with cloud deployment experience.', ?)`,
      [adminId]
    );

    const [app1] = await conn.query(
      "INSERT INTO applications (candidate_id, job_id, status, applied_date) VALUES (?, ?, 'shortlisted', '2026-06-10')",
      [cand1.insertId, job1.insertId]
    );
    const [app2] = await conn.query(
      "INSERT INTO applications (candidate_id, job_id, status, applied_date) VALUES (?, ?, 'interview', '2026-06-12')",
      [cand2.insertId, job2.insertId]
    );
    await conn.query(
      "INSERT INTO applications (candidate_id, job_id, status, applied_date) VALUES (?, ?, 'applied', '2026-06-15')",
      [cand3.insertId, job3.insertId]
    );

    await conn.query(
      "INSERT INTO interviews (application_id, interview_date, interviewer, result) VALUES (?, '2026-06-20 11:00:00', 'Rachit Recruiter', 'pending')",
      [app2.insertId]
    );

    console.log("Seed complete.");
    console.log("Admin login: admin@recruitai.com / Password123");
    console.log("Recruiter login: recruiter@recruitai.com / Password123");
  } finally {
    conn.release();
    process.exit(0);
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
