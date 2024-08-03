import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const email = process.env.EMAIL;
const password = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass: password,
  },
});

const emailService = async (to, subject, html) => {
  try {
    let info = await transporter.sendMail({
      from: email,
      to: to,
      subject: subject,
      html: html, //if you need to add text change text if you need to some Html so that type ok
    });

    console.log(`Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export default emailService;
