// server/services/mailService.js
const nodemailer = require('nodemailer');
const winston = require('winston');

// Winston Logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = async (to, subject, body) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

const sendVerificationEmail = async (to, verificationCode) => {
  const subject = 'Verify Your Email - ImageGallery';
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; text-align: center;">Welcome to ImageGallery!</h2>
      <p style="color: #666; font-size: 16px; line-height: 1.5;">
        Thank you for registering. Please verify your email address by entering the following code:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; font-size: 32px; font-weight: bold; color: #007bff; background: #f8f9fa; padding: 20px 40px; border-radius: 8px; letter-spacing: 4px;">
          ${verificationCode}
        </span>
      </div>
      <p style="color: #666; font-size: 14px;">
        This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">
        ImageGallery Team
      </p>
    </div>
  `;

  return await sendMail(to, subject, body);
};

module.exports = {
  sendMail,
  sendVerificationEmail,
};
