// import JobApplication from "../models/JobApplication.js";
// import path from "path";

// export const uploadResume = async (req, res) => {
//   try {
//     const { email, jobId } = req.body;
//     if (!email || !jobId) {
//       return res.status(400).json({ message: "Email and Job ID required" });
//     }

//     const application = await JobApplication.findOne({ email, jobId });
//     if (!application) {
//       return res.status(404).json({ message: "Application not found" });
//     }
//     if (!application.isEmailVerified) {
//       return res.status(400).json({ message: "Please verify email first" });
//     }
//     if (!req.file) {
//       return res.status(400).json({ message: "Resume file is required" });
//     }

//     const resumePath = `uploads/resumes/${req.file.filename}`;
//     application.resume = resumePath;
//     await application.save();

//     console.log("Resume uploaded successfully:", resumePath);

//     return res.json({
//       success: true,
//       message: "Application submitted successfully!",
//       resume: resumePath
//     });

//   } catch (err) {
//     console.error("Resume Upload Error:", err.message);
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// };


// export const getAllApplications = async (req, res) => {
//   try {
//     const applications = await JobApplication.find()
//       .populate("jobId", "title")  // Job ka title dikhega
//       .sort({ createdAt: -1 });

//     res.json(applications);
//   } catch (err) {
//     console.error("Error fetching applications:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };



import JobApplication from "../models/JobApplication.js";
import path from "path";
import brevo from '@getbrevo/brevo';

let apiInstance = null;

const getApiInstance = () => {
  if (!apiInstance) {
    if (!process.env.BREVO_API_KEY) {
      console.error("BREVO_API_KEY missing in .env");
      return null;
    }
    apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
    console.log("Brevo API Connected Successfully!");
  }
  return apiInstance;
};

export const uploadResume = async (req, res) => {
  try {
    const { email, jobId } = req.body;
    if (!email || !jobId) {
      return res.status(400).json({ message: "Email and Job ID required" });
    }

    const application = await JobApplication.findOne({ email, jobId })
      .populate("jobId", "title"); // Job title bhi la rahe hain

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    if (!application.isEmailVerified) {
      return res.status(400).json({ message: "Please verify email first" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const resumePath = `uploads/resumes/${req.file.filename}`;
    application.resume = resumePath;
    await application.save();

    console.log("Resume uploaded successfully:", resumePath);

    // =============== NEW: Send Notification Email to Admin ===============
    const api = getApiInstance();
    if (api) {
      const jobTitle = application.jobId?.title || "Unknown Job";

      const adminEmailData = {
        sender: {
          name: process.env.BREVO_SENDER_NAME || "The IT Talent",
          email: process.env.BREVO_SENDER_EMAIL
        },
        to: [
          { email: "51110102967@piemr.edu.in" }, // ← Yahan apna admin email daalo
          // Agar multiple: { email: "another@admin.com" }
        ],
        subject: `New Job Application - ${application.name} for ${jobTitle}`,
        htmlContent: `
          <h2>New Job Application Received!</h2>
          <p><strong>Candidate Name:</strong> ${application.name || "Not provided"}</p>
          <p><strong>Email:</strong> ${application.email}</p>
          <p><strong>Phone:</strong> ${application.phone || "Not provided"}</p>
          <p><strong>Job Applied For:</strong> ${jobTitle} (ID: ${jobId})</p>
          <p><strong>Description/ Cover Letter:</strong><br>
            ${application.description ? application.description.replace(/\n/g, "<br>") : "Not provided"}
          </p>
          <p><strong>Resume:</strong> 
            <a href="${process.env.APP_URL}/admin/${resumePath}" target="_blank">
              View/Download Resume
            </a>
          </p>
          <hr>
          <p><small>Submitted on: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</small></p>
          <p><small>Application ID: ${application._id}</small></p>
        `
      };

      try {
        await api.sendTransacEmail(adminEmailData);
        console.log("Admin notification email sent for job application:", application.email);
      } catch (emailErr) {
        console.error("Failed to send admin notification email:", emailErr.message || emailErr);
        // Email fail hone par bhi application submit rahegi – user ko disturb nahi karna
      }
    } else {
      console.error("Brevo API not initialized – Admin email not sent");
    }
    // =====================================================================

    return res.json({
      success: true,
      message: "Application submitted successfully!",
      resume: resumePath
    });

  } catch (err) {
    console.error("Resume Upload Error:", err.message);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find()
      .populate("jobId", "title")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ message: "Server error" });
  }
};