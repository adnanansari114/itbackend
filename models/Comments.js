
// import mongoose from "mongoose";

// const commentSchema = new mongoose.Schema({
//   blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
//   blogtitle: String,
//   name: String,
//   email: String,
//   website: String,
//   comment: String,
//   createdAt: { type: Date, default: Date.now }
// });

// // Yeh line badlo
// // module.exports = mongoose.model("Comment", commentSchema);

// // Nayi line → ESM style
// const Comment = mongoose.model("Comment", commentSchema);
// export default Comment;

import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  blogTitle: { type: String, required: true }, // Exact "blogTitle"
  name: { type: String, required: true },
  email: { type: String, required: false }, // Reply ke liye optional
  website: { type: String },
  comment: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;