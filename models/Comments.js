// const mongoose = require("mongoose");

// const commentSchema = new mongoose.Schema({
//   blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
//   blogtitle: String,
//   name: String,
//   email: String,
//   website: String,
//   comment: String,
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Comment", commentSchema);

import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
  blogtitle: String,
  name: String,
  email: String,
  website: String,
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

// Yeh line badlo
// module.exports = mongoose.model("Comment", commentSchema);

// Nayi line → ESM style
const Comment = mongoose.model("Comment", commentSchema);
export default Comment;