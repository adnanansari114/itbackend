import express from "express";
import { createJob, getJobs, updateJob, deleteJob } from "../controllers/jobController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/", adminAuth, createJob);

router.get("/:id", getJobs);

router.put("/:id", adminAuth, updateJob);

router.delete("/:id", adminAuth, deleteJob);

export default router;