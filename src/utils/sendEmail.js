import nodemailer from "nodemailer";
import "dotenv/config";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
  SMTP_FROM
} = process.env;

let configOptions = {
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  }
}

const transport = nodemailer.createTransport(configOptions);

const sendEmail = data => {
  const email = {
    ...data,
    from: SMTP_FROM
  };
  return transport.sendMail(email);
}

export default sendEmail;
