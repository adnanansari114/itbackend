// routes/categoryRoutes.js
import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";

const router = express.Router();

// Admin protected routes
router
  .route("/")
  .get(adminAuth, getCategories)        // GET all
  .post(adminAuth, createCategory);     // Create new

router
  .route("/:id")
  .put(adminAuth, updateCategory)       // Update
  .delete(adminAuth, deleteCategory);   // Delete

export default router;