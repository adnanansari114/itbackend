// import express from "express";
// import Comment from "../models/Comments.js";  
// import Blog from "../models/Blog.js";

// const router = express.Router();

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

// router.get("/all", async (req, res) => {
//   try {
//     const comments = await Comment.find().populate("blogId", "title");
//     res.json(comments);
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// router.delete("/delete/:id", async (req, res) => {
//   try {
//     await Comment.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: "Comment deleted!" });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// export default router;


import express from "express";
import Comment from "../models/Comments.js";  
import Blog from "../models/Blog.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { blogId, blogtitle, name, email, website, comment, parentId } = req.body;

    const newComment = new Comment({ blogId, blogtitle, name, email, website, comment, parentId });
    await newComment.save();

    res.json({ success: true, message: "Comment submitted!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const comments = await Comment.find().populate("blogId", "title");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// New GET for blog-specific threaded comments
router.get("/blog/:blogId", async (req, res) => {
  try {
    const comments = await Comment.aggregate([
      { $match: { blogId: new mongoose.Types.ObjectId(req.params.blogId) } },
      { $sort: { createdAt: -1 } },
      {
        $graphLookup: {
          from: "comments",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parentId",
          as: "replies",
          depthField: "depth"
        }
      },
      { $match: { parentId: null } } // Only top-level comments
    ]);
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

export default router;