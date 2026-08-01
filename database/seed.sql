USE recruitai;

-- Password for both users below is: Password123
-- (hash generated with bcryptjs, 10 rounds — replace via utils/seed.js for real hashing)

INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@recruitai.com', '$2a$10$replaceWithRealBcryptHash', 'admin'),
('Rachit Recruiter', 'recruiter@recruitai.com', '$2a$10$replaceWithRealBcryptHash', 'recruiter');

INSERT INTO jobs (title, description, required_skills, location, salary, status, created_by) VALUES
('Frontend Developer', 'Build responsive UIs using React.', 'React, JavaScript, CSS, Tailwind', 'Remote', '6-10 LPA', 'open', 2),
('Backend Developer', 'Design and maintain REST APIs.', 'Node.js, Express, MySQL', 'Bangalore', '8-12 LPA', 'open', 2),
('Full Stack Developer', 'End-to-end feature development.', 'React, Node.js, MySQL, AWS', 'Delhi', '10-15 LPA', 'open', 1);

INSERT INTO candidates (name, email, phone, skills, experience, education, resume, created_by) VALUES
('Aarav Sharma', 'aarav.sharma@example.com', '9876543210', 'React, JavaScript, HTML, CSS', '2 years', 'B.Tech CSE', 'Experienced frontend developer skilled in React and modern JS.', 2),
('Priya Verma', 'priya.verma@example.com', '9876500001', 'Node.js, Express, MySQL', '3 years', 'B.Tech IT', 'Backend engineer with strong API design experience.', 2),
('Karan Mehta', 'karan.mehta@example.com', '9876500002', 'React, Node.js, MongoDB, AWS', '4 years', 'M.Tech CSE', 'Full stack developer with cloud deployment experience.', 1);

INSERT INTO applications (candidate_id, job_id, status, applied_date) VALUES
(1, 1, 'shortlisted', '2026-06-10'),
(2, 2, 'interview', '2026-06-12'),
(3, 3, 'applied', '2026-06-15');

INSERT INTO interviews (application_id, interview_date, interviewer, result) VALUES
(2, '2026-06-20 11:00:00', 'Rachit Recruiter', 'pending');
