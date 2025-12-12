// import express from "express";
// import { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog } from "../controllers/blogController.js";
// import { adminAuth } from "../middleware/adminAuth.js";

// const router = express.Router();

// router.post("/", adminAuth, createBlog);
// router.get("/", getBlogs); 
// router.get("/:id", getBlogById);
// router.put("/:id", adminAuth, updateBlog);
// router.delete("/:id", adminAuth, deleteBlog);

// export default router;


// routes/blogRoutes.js
import express from "express";
import { 
  createBlog, 
  getBlogs, 
  getBlogById, 
  updateBlog, 
  deleteBlog 
} from "../controllers/blogController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js"; // ← YE IMPORT KARO

const router = express.Router();

// Image upload ke saath create aur update
router.post("/", adminAuth, upload.single("image"), createBlog);
router.put("/:id", adminAuth, upload.single("image"), updateBlog);

router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.delete("/:id", adminAuth, deleteBlog);

export default router;