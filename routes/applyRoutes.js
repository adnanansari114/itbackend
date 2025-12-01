import express from "express";
import { sendVerificationCode, verifyCode } from "../controllers/verifyController.js";
import { uploadResume } from "../controllers/applicationController.js";
import upload from "../middleware/upload.js"; 

const router = express.Router();

router.post("/send-code", sendVerificationCode);
router.post("/verify-code", verifyCode);
router.post("/upload-resume", upload.single("resume"), uploadResume);

export default router;
