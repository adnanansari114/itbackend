const express = require("express");
const Comment = require("../models/Comments");
const Blog = require("../models/Blog");
const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { blogId, blogtitle, name, email, website, comment } = req.body;

    const newComment = new Comment({ blogId, blogtitle, name, email, website, comment });
    await newComment.save();

    res.json({ success: true, message: "Comment submitted!" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.get("/all", async (req, res) => {
  try {
    const comments = await Comment.find().populate("blogId", "title");
    res.json(comments);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Comment deleted!" });
  } catch (error) {
    res.status(500).json(error);
  }
});


module.exports = router;
