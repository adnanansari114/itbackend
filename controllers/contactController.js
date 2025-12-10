import Contact from "../models/Contact.js";
import axios from "axios";

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, company, userLocation, companyLocation, message, 'g-recaptcha-response': token } = req.body;

    const secretKey = process.env.RECAPTCHA_SECRET_KEY; 
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
    const recapRes = await axios.post(verifyUrl);
    if (!recapRes.data.success) {
      return res.status(400).json({ message: "reCAPTCHA verification failed. Are you a robot?" });
    }
    
    await Contact.create({
      name,
      email,
      phone,
      company,
      messageuserLocation, 
      companyLocation
    });

    res.json({ success: true, message: "Message submitted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const list = await Contact.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};



