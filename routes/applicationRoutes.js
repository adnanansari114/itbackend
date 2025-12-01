import express from "express";
import multer from "multer";
import { sendVerificationCode, verifyCode } from "../controllers/verifyController.js";
import { uploadResume } from "../controllers/applicationController.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// Folder bana do agar nahi hai
const uploadDir = "uploads/resumes";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created folder: uploads/resumes");
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, DOCX allowed"));
    }
  }
});

router.post("/send-otp", sendVerificationCode);
router.post("/verify-otp", verifyCode);
router.post("/upload-resume", upload.single("resume"), uploadResume);

export default router;