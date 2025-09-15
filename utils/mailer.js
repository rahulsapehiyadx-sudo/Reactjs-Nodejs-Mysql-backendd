require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
    // port: 465,
    // secure: true,  // true for 465, false for 587
  },
});
const sendOTP = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "OTP confirmation verification for valid user",
    text: `Your OTP is: ${otp} `,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(` OTP email sent to ${to}: ${info.response}`);
    return info;
  } catch (error) {
    console.error(` Failed to send OTP email to ${to}:`, error.message);
    throw error; // rethrow so controller can still handle
  }
};

module.exports = sendOTP;
