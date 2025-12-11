
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


// import mongoose from "mongoose";

// const commentSchema = new mongoose.Schema({
//   blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
//   blogtitle: { type: String, required: true },
//   name: { type: String, required: true },
//   email: { type: String }, // Optional for replies
//   website: { type: String }, // Optional for replies
//   comment: { type: String, required: true },
//   parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null }, // For replies
//   createdAt: { type: Date, default: Date.now }
// });

// const Comment = mongoose.model("Comment", commentSchema);
// export default Comment;


// Comment.js (FINAL - WORKING)
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  blogId: { type: String, required: true },           // ← YEH STRING RAKHO
  blogtitle: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String },
  website: { type: String },
  comment: { type: String, required: true },
  parentId: { type: String, default: null },          // ← YEH BHI STRING
  createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;