import express from "express";
import Comment from "../models/Comments.js";  
import Blog from "../models/Blog.js";

const router = express.Router();

// router.post("/add", async (req, res) => {
//   try {
//     const { blogId, blogtitle, name, email, website, comment } = req.body;

//     const newComment = new Comment({ blogId, blogtitle, name, email, website, comment });
//     await newComment.save();

//     res.json({ success: true, message: "Comment submitted!" });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

router.get("/all", async (req, res) => {
  try {
    const comments = await Comment.find().populate("blogId", "title");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Comment deleted!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});



router.post("/add", async (req, res) => {
  try {
    const { blogId, blogTitle, name, email, website, comment, parentId = null } = req.body;

    // Log incoming request
    console.log("Request body:", req.body);

    // Validation
    if (!blogId || !blogTitle || !name || !comment) {
      console.log("Missing fields:", { blogId, blogTitle, name, comment });
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newComment = new Comment({
      blogId,
      blogTitle,
      name,
      email: email || "",
      website: website || "",
      comment,
      parentId
    });

    await newComment.save();

    // If reply, add to parent's replies array
    if (parentId) {
      await Comment.findByIdAndUpdate(parentId, {
        $push: { replies: newComment._id }
      });
    }

    res.json({ success: true, comment: newComment });
  } catch (error) {
    console.error("Comment add error:", error.message, error.stack);
    res.status(500).json({ success: false, error: error.message });
  }
});


// Get all comments for a blog (top level only, replies nested)
router.get("/blog/:blogId", async (req, res) => {
  try {
    const comments = await Comment.find({ 
      blogId: req.params.blogId, 
      parentId: null 
    })
    .sort({ createdAt: -1 })
    .populate("replies"); // nested replies load ho jayenge

    res.json(comments);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

