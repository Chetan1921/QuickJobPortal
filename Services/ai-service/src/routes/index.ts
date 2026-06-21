import { Router } from "express";
import { getCareerGuidance } from "../controllers/careerController.js";
import { analyzeResume } from "../controllers/resumeController.js";
import { isAuth } from "../middleware/auth.js";

const router = Router();

router.get("/career-guidance", isAuth, getCareerGuidance);
router.post("/resume-analyze", isAuth, analyzeResume);

export default router;