import { Router } from "express";
import authRoutes from "./auth.routes.js";
import candidateRoutes from "./candidate.routes.js";
import jobRoutes from "./job.routes.js";
import applicationRoutes from "./application.routes.js";
import aiRoutes from "./ai.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "RecruitAI CRM API is running" });
});

router.use("/auth", authRoutes);
router.use("/candidates", candidateRoutes);
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes);
router.use("/ai", aiRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
