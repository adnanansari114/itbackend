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
  paragraphs1: [{ type: String }], 
  image: {
    type: String,                   
    default: null                  
  },
  
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Blog", blogSchema);