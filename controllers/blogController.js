// import Blog from "../models/Blog.js";

// export const createBlog = async (req, res) => {
//   try {
//     const blog = await Blog.create(req.body);
//     res.status(201).json({ message: "Blog created successfully", blog });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error creating blog", error: err.message });
//   }
// };

// export const getBlogs = async (req, res) => {
//   try {
//     const blogs = await Blog.find().sort({ createdAt: -1 });
//     res.json(blogs);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching blogs" });
//   }
// };

// export const getBlogById = async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) {
//       return res.status(404).json({ message: "Blog not found" });
//     }
//     res.json(blog);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching blog", error: err.message });
//   }
// };

// export const updateBlog = async (req, res) => {
//   try {
//     const updated = await Blog.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     if (!updated) {
//       return res.status(404).json({ message: "Blog not found" });
//     }
//     res.json({ message: "Blog updated successfully", blog: updated });
//   } catch (err) {
//     res.status(500).json({ message: "Error updating blog", error: err.message });
//   }
// };

// export const deleteBlog = async (req, res) => {
//   try {
//     const deleted = await Blog.findByIdAndDelete(req.params.id);
//     if (!deleted) {
//       return res.status(404).json({ message: "Blog not found" });
//     }
//     res.json({ message: "Blog deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Error deleting blog", error: err.message });
//   }
// };


// controllers/blogController.js
import Blog from "../models/Blog.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs"; // file delete karne ke liye temp se

export const createBlog = async (req, res) => {
  try {
    let imageUrl = null;

    // Agar image upload ki gayi ho
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;

      // Temporary file delete kar do
      fs.unlink(req.file.path, (err) => {
        if (err) console.log("Temp file delete error:", err);
      });
    }

    const blogData = {
      ...req.body,
      image: imageUrl
    };

    const blog = await Blog.create(blogData);
    res.status(201).json({ message: "Blog created successfully", blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating blog", error: err.message });
  }
};

// controllers/blogController.js → updateBlog function mein

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    let imageUrl = blog.image; // purani image

    if (req.file) {
      // Agar purani image thi Cloudinary pe, to delete kar do
      if (blog.image) {
        const publicId = blog.image.split("/").pop().split(".")[0]; // extract public_id
        await cloudinary.uploader.destroy(publicId); // ye line add karo
      }

      // Nayi image upload karo
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;

      // Temp file delete
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

// Baaki functions same rahenge
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

    // Agar image hai Cloudinary pe, delete kar do
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