import JobApplication from "../models/JobApplication.js";
import path from "path";

export const uploadResume = async (req, res) => {
  try {
    const { email, jobId } = req.body;
    if (!email || !jobId) {
      return res.status(400).json({ message: "Email and Job ID required" });
    }

    const application = await JobApplication.findOne({ email, jobId });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    if (!application.isEmailVerified) {
      return res.status(400).json({ message: "Please verify email first" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const resumePath = `uploads/resumes/${req.file.filename}`;
    application.resume = resumePath;
    await application.save();

    console.log("Resume uploaded successfully:", resumePath);

    return res.json({
      success: true,
      message: "Application submitted successfully!",
      resume: resumePath
    });

  } catch (err) {
    console.error("Resume Upload Error:", err.message);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};