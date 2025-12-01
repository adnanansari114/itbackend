import express from "express";
import { createAdmin, loginAdmin } from "../controllers/adminController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { createJob, getJobs } from "../controllers/jobController.js";

const router = express.Router();

router.post("/create", createAdmin);
router.post("/login", loginAdmin);

router.post("/add-job", adminAuth, createJob);
router.get("/jobs", getJobs);

export default router;
