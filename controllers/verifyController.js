
import JobApplication from "../models/JobApplication.js";
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

export const sendVerificationCode = async (req, res) => {
  try {
    const { name, email, phone, description, jobId } = req.body;
    if (!email || !jobId) {
      return res.status(400).json({ message: "Email and Job ID required" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    let application = await JobApplication.findOne({ email, jobId });
    if (!application) {
      application = new JobApplication({
        name, email, phone, description, jobId,
        verificationCode: code,
        isEmailVerified: false
      });
    } else {
      application.verificationCode = code;
      application.isEmailVerified = false;
    }
    await application.save();

    const api = getApiInstance();
    if (!api) {
      return res.status(500).json({ message: "Email service not available" });
    }

    const sendSmtpEmail = {
      sender: {
        name: process.env.BREVO_SENDER_NAME || "The IT Talent",
        email: process.env.BREVO_SENDER_EMAIL
      },
      to: [{ email, name: name || "Applicant" }],
      subject: "Your Job Application OTP",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 30px; background: #f8f9fa; border-radius: 12px;">
          <h1 style="color: #1a73e8; font-size: 48px; letter-spacing: 8px; background: white; padding: 20px; border-radius: 10px; display: inline-block;">
            ${code}
          </h1>
          <p style="font-size: 18px; color: #333; margin-top: 20px;">
            Your OTP is valid for <strong>10 minutes</strong>
          </p>
          <p>Thank you for applying at <strong>The IT Talent</strong>!</p>
        </div>
      `
    };

    await api.sendTransacEmail(sendSmtpEmail);
    console.log("OTP sent successfully to:", email);

    res.json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Brevo API Error:", error.message || error);
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

export const verifyCode = async (req, res) => {
  try {
    const { email, code, jobId } = req.body;
    if (!email || !code || !jobId) {
      return res.status(400).json({ message: "Email, OTP, and Job ID required" });
    }

    const application = await JobApplication.findOne({ email, jobId });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    application.isEmailVerified = true;
    application.verificationCode = null;
    await application.save();

    res.json({ success: true, message: "Email verified successfully!" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};