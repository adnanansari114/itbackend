
import Job from "../models/Job.js"; 

export const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ message: "Job created successfully", job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating job", error: err.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
};

export const updateJob = async (req, res) => {
  try {
    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      {
        techstack: req.body.techstack,
        company: "The IT Talent",
        engagementtype: req.body.engagementtype,
        status: req.body.status,
        location: req.body.location,
        budget: req.body.budget,
        description: req.body.description,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job updated successfully", job: updated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating job", error: err.message });
  }
};





// 🔥 Delete Job (Admin Only)
export const deleteJob = async (req, res) => {
  console.log("Delete request by admin ID:", req.admin?.id); // ← ye line laga
  console.log("Job ID to delete:", req.params.id);
  
  try {
    const deleted = await Job.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting job", error: err.message });
  }
};