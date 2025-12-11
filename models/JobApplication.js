// import mongoose from "mongoose";

// const applicationSchema = new mongoose.Schema({
//   jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
//   name: String,
//   email: String,
//   phone: String,
//   jobName: String,
//   description: String,
//   verificationCode: String,
//   isEmailVerified: { type: Boolean, default: false },
//   resume: String,          
//   createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.model("JobApplication", applicationSchema);


import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  jobName: { type: String, required: true }, // Techstack will be stored here
  description: { type: String },
  verificationCode: String,
  isEmailVerified: { type: Boolean, default: false },
  resume: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Optional: Add index for better query performance on email + jobId
applicationSchema.index({ email: 1, jobId: 1 }, { unique: true });

export default mongoose.model("JobApplication", applicationSchema);