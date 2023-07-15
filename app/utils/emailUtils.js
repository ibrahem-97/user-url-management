const nodemailer = require("nodemailer");

// Create a transporter using SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-gmail-account@gmail.com",
    pass: "your-gmail-account-password",
  },
});

const sendPasswordResetEmail = async (email, newPassword) => {
  const mailOptions = {
    from: "your-gmail-account@gmail.com",
    to: email,
    subject: "Password Reset",
    text: `Your new password is: ${newPassword}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

module.exports = { sendPasswordResetEmail };
