import express from "express";
import { createJob, getJobs, updateJob, deleteJob } from "../controllers/jobController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import Job from "../models/Job.js";

const router = express.Router();

router.post("/", adminAuth, createJob);

router.get("/", getJobs);

router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/:id", adminAuth, updateJob);

router.delete("/:id", adminAuth, deleteJob);

export default router;