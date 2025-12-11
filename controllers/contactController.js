// import Contact from "../models/Contact.js";
// import axios from "axios";

// export const submitContact = async (req, res) => {
//   try {
//     const { name, email, phone, company, userLocation, companyLocation, message, 'g-recaptcha-response': token } = req.body;

//     const secretKey = process.env.RECAPTCHA_SECRET_KEY; 
//     const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
//     const recapRes = await axios.post(verifyUrl);
//     if (!recapRes.data.success) {
//       return res.status(400).json({ message: "reCAPTCHA verification failed. Are you a robot?" });
//     }
    
//     await Contact.create({
//       name,
//       email,
//       phone,
//       company,
//       userLocation, 
//       companyLocation,
//       message
//     });

//     res.json({ success: true, message: "Message submitted successfully" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// export const getAllContacts = async (req, res) => {
//   try {
//     const list = await Contact.find().sort({ createdAt: -1 });
//     res.json(list);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching messages" });
//   }
// };



import Contact from "../models/Contact.js";
import axios from "axios";

export const submitContact = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      userLocation,
      companyLocation,
      message,
      "g-recaptcha-response": token,
    } = req.body;

    // === reCAPTCHA Verification ===
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
    const recapRes = await axios.post(verifyUrl);

    if (!recapRes.data.success) {
      return res.status(400).json({ message: "reCAPTCHA verification failed. Are you a robot?" });
    }

    // === Save to Database ===
    const newContact = await Contact.create({
      name,
      email,
      phone,
      company,
      userLocation,
      companyLocation,
      message,
    });

    // === Send Notification Email via Brevo ===
    const brevoApiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL; // murtaza@theittalent.com
    const senderName = process.env.BREVO_SENDER_NAME;   // The IT Talent

    // Yahan apna/admin ka email daalo jahan notification chahiye
    const adminEmail = "51110102967@piemr.edu.in"; // Ya jo bhi email chahiye (multiple bhi daal sakte ho)

    const emailData = {
      sender: { name: senderName, email: senderEmail },
      to: [
        { email: adminEmail }, // ← Yahan change kar sakte ho
        // Agar multiple: { email: "another@admin.com" }
      ],
      subject: `New Contact Form Submission from ${name}`,
      htmlContent: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Company:</strong> ${company || "Not provided"}</p>
        <p><strong>User Location:</strong> ${userLocation || "Not provided"}</p>
        <p><strong>Company Location:</strong> ${companyLocation || "Not provided"}</p>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p><small>Submitted on: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</small></p>
        <p><small>Contact ID: ${newContact._id}</small></p>
      `,
    };

    try {
      await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        emailData,
        {
          headers: {
            "api-key": brevoApiKey,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      );
      console.log("Notification email sent successfully to admin");
    } catch (emailErr) {
      console.error("Brevo Email Error:", emailErr.response?.data || emailErr.message);
      // Email fail hone par bhi form submit successful rahega (user ko issue nahi hona chahiye)
    }

    // === Response to Frontend ===
    res.json({ success: true, message: "Message submitted successfully" });
  } catch (err) {
    console.error("Contact Submit Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const list = await Contact.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching messages" });
  }
};