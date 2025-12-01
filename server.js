import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

connectDB();

const app = express();

const frontendURL = 'https://itcompanyfrontend.onrender.com'

// app.use(cors());

app.use(cors({
    origin: frontendURL, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/jobs", jobRoutes);
app.use("/api/admin", adminRoutes); 
app.use("/api/contact", contactRoutes);
app.use("/api/apply", applicationRoutes);
app.use("/api/comments", commentRoutes);
// app.use("/api/apply", applicationRoutes);
app.use("/uploads", express.static("uploads"));

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
