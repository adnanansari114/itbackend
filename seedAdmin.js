// import { Resend } from 'resend';
// const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendVerificationEmail = async (to, name, link, type) => {
//   const subject = type === 'comment' 
//     ? 'Verify Your Comment' 
//     : 'Verify Your Job Application';

//   await resend.emails.send({
//     from: process.env.FROM_EMAIL,
//     to,
//     subject,
//     html: `
//       <h2>Hi ${name}!</h2>
//       <p>Click below to verify your ${type === 'comment' ? 'comment' : 'application'}:</p>
//       <a href="${link}" style="background:#f97316;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;">
//         Verify Now
//       </a>
//       <p>Link expires in 1 hour.</p>
//     `
//   });
// };