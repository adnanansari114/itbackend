import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createAdmin = async (req, res) => {
  const exist = await Admin.findOne({ email: req.body.email });
  if (exist) return res.json({ message: "Admin already exists" });

  const admin = await Admin.create(req.body);
  res.json({ message: "Admin created", admin });
};

export const loginAdmin = async (req, res) => {
  const admin = await Admin.findOne({ email: req.body.email });
  if (!admin) return res.json({ message: "Admin not found" });

  const match = await bcrypt.compare(req.body.password, admin.password);
  if (!match) return res.json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: admin._id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ message: "Login success", token });
};
