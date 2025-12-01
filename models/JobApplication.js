import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  name: String,
  email: String,
  phone: String,
  description: String,
  verificationCode: String,
  isEmailVerified: { type: Boolean, default: false },
  resume: String,          
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("JobApplication", applicationSchema);
