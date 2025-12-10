import express from "express";
import { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog } from "../controllers/blogController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/", adminAuth, createBlog);
router.get("/", getBlogs); // Public or admin? Agar admin only to adminAuth add kar do
router.get("/:id", adminAuth, getBlogById);
router.put("/:id", adminAuth, updateBlog);
router.delete("/:id", adminAuth, deleteBlog);

export default router;