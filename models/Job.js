import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  techstack: { type: String, required: true },
  company: { type: String, required: true },
  status: {type: String},
  location: { type: String, required: true },
  engagementtype: { type: String, required: true },
  budget: {type: String},
  description: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Job", jobSchema);