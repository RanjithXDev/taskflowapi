import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let transporter: any;

if (process.env.NODE_ENV === "test") {
  const nodemailerMock = require("nodemailer-mock");
  transporter = nodemailerMock.createTransport({});
} else {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {

  await transporter.sendMail({
    from: `"Task Manager" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });

};