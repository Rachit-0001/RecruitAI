import api from "./api";

export const authService = {
  login: (data) => api.post("/auth/login", data).then((r) => r.data),
  register: (data) => api.post("/auth/register", data).then((r) => r.data),
  profile: () => api.get("/auth/profile").then((r) => r.data),
};

export const candidateService = {
  list: (search) => api.get("/candidates", { params: { search } }).then((r) => r.data),
  get: (id) => api.get(`/candidates/${id}`).then((r) => r.data),
  create: (data) => api.post("/candidates", data).then((r) => r.data),
  update: (id, data) => api.put(`/candidates/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/candidates/${id}`).then((r) => r.data),
};

export const jobService = {
  list: (status) => api.get("/jobs", { params: { status } }).then((r) => r.data),
  get: (id) => api.get(`/jobs/${id}`).then((r) => r.data),
  create: (data) => api.post("/jobs", data).then((r) => r.data),
  update: (id, data) => api.put(`/jobs/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/jobs/${id}`).then((r) => r.data),
};

export const applicationService = {
  list: () => api.get("/applications").then((r) => r.data),
  create: (data) => api.post("/applications", data).then((r) => r.data),
  update: (id, data) => api.put(`/applications/${id}`, data).then((r) => r.data),
};

export const interviewService = {
  list: () => api.get("/interviews").then((r) => r.data),
  create: (data) => api.post("/interviews", data).then((r) => r.data),
};

export const dashboardService = {
  get: () => api.get("/dashboard").then((r) => r.data),
};

export const aiService = {
  resumeSummary: (data) => api.post("/ai/resume-summary", data).then((r) => r.data),
  jobMatch: (data) => api.post("/ai/job-match", data).then((r) => r.data),
  interviewQuestions: (data) => api.post("/ai/interview-questions", data).then((r) => r.data),
};
