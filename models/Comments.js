
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


// models/Comment.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  blogTitle: { type: String, required: true }, // tum already bhej rahe ho frontend se
  name: { type: String, required: true },
  email: { type: String, required: true },
  website: String,
  comment: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null }, // null = top level
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // nested replies
  createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;