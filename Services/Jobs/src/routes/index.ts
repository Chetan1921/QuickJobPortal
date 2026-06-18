import express from 'express'
import { isAuth } from '../middleware/auth.js';
import { ApplyForJob, CreateCompany, CreateJob, DeleteCompany, GetAllActiveJobs, GetAllApplications, GetAllCompanies, GetApplicationsByJob, GetCompanyById, GetJobById, UpdateApplication, UpdateJob } from '../controllers/index.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post("/company/new", isAuth, upload, CreateCompany);
router.delete("/delete/:companyId", isAuth, DeleteCompany);
router.post("/new", isAuth, upload, CreateJob);
router.put("/update/:jobId", isAuth, upload, UpdateJob);
router.get("/all", isAuth, upload, GetAllCompanies);
router.get("/company/:companyId", isAuth, upload, GetCompanyById)
router.get("/Activejob", GetAllActiveJobs);
router.get("/:jobId", GetJobById)
router.post("/apply", isAuth, upload, ApplyForJob);
router.get("/application/all", isAuth, upload, GetAllApplications);
router.get("/application/:jobId", isAuth, upload, GetApplicationsByJob);
router.put("/application/update/:id", isAuth, UpdateApplication);
export default router;