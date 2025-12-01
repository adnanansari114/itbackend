import express from "express";
import { submitContact, getAllContacts } from "../controllers/contactController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/", submitContact);

router.get("/all", adminAuth, getAllContacts);

export default router;
