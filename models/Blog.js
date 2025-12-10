import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  heading1: { type: String, required: true },
  paragraphs1: [{ type: String }], // Array for multiple paragraphs
  heading2: { type: String, required: true },
  paragraphs2: [{ type: String }], // Array for multiple paragraphs
  whyChoosePoints: [{ type: String }], // Array for exactly 4 points
  additionalHeading: { type: String, required: true },
  additionalPoints: [{ type: String }], // Array for exactly 5 points
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Blog", blogSchema);