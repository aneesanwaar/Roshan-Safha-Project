const nodemailer = require('nodemailer');

// 1. Configure the transporter
// For production, use your actual Gmail/SMTP details in .env
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

/**
 * Professional Email Service for Roshan Safha
 * @param {Object} options - { to, subject, text, html }
 */
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"Roshan Safha" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Email Error:', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;