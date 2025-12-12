
import Blog from "../models/Blog.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs"; 

export const createBlog = async (req, res) => {
  try {
    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      fs.unlink(req.file.path, () => {});
    }

    let paragraphs1 = [];
    if (req.body.paragraphs1) {
      try {
        const parsed = JSON.parse(req.body.paragraphs1);
        paragraphs1 = Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        paragraphs1 = typeof req.body.paragraphs1 === "string" 
          ? req.body.paragraphs1.split(",").map(p => p.trim()).filter(Boolean)
          : [];
      }
    }

    const title = req.body.title?.trim() || "Untitled Blog";
    const heading1 = req.body.heading1?.trim() || "No Heading";

    if (!title || !heading1 || paragraphs1.length === 0) {
      return res.status(400).json({ message: "Title, heading and paragraphs required" });
    }

    const blogData = {
      title,
      heading1,
      paragraphs1: paragraphs1.filter(p => p.trim()),
      image: imageUrl  
    };

    const blog = await Blog.create(blogData);
    res.status(201).json({ message: "Blog created!", blog });

  } catch (err) {
    console.error("Create blog error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    let imageUrl = blog.image; 

    if (req.file) {
      if (blog.image) {
        const publicId = blog.image.split("/").pop().split(".")[0]; 
        await cloudinary.uploader.destroy(publicId); 
      }

      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;

      fs.unlink(req.file.path, (err) => {
        if (err) console.log("Temp delete error:", err);
      });
    }

    const updatedData = {
      ...req.body,
      image: imageUrl,
    };

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json({ message: "Blog updated", blog: updatedBlog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching blogs" });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Error fetching blog", error: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.image) {
      const publicId = blog.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};