// import mongoose from "mongoose";

// const blogSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   heading1: { type: String, required: true },
//   paragraphs1: [{ type: String }], // Array for multiple paragraphs
//   isActive: { type: Boolean, default: true },
//   createdAt: { type: Date, default: Date.now }
// });

// export default mongoose.model("Blog", blogSchema);


import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  heading1: { type: String, required: true },
  paragraphs1: [{ type: String }], // Array for multiple paragraphs
  
  // ← YE NAYA FIELD ADD KARO
  image: {
    type: String,                   // Cloudinary ya kisi storage ka public URL store hoga
    default: null                   // Agar image nahi hai to null
  },
  // Ya phir agar multiple images chahiye future mein
  // images: [{ type: String }]

  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Blog", blogSchema);