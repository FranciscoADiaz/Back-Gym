const nodemailer = require("nodemailer");

// Variables de entorno esperadas:
// SMTP_HOST, SMTP_PORT, SMTP_SECURE ("true"/"false"), SMTP_USER, SMTP_PASS
// Alternativas rápidas:
// - Para Gmail: SMTP_HOST=smtp.gmail.com, SMTP_PORT=465, SMTP_SECURE=true
// - Para Outlook/Office365: SMTP_HOST=smtp.office365.com, SMTP_PORT=587, SMTP_SECURE=false

const host = process.env.SMTP_HOST || "smtp.gmail.com";
const port = Number(
  process.env.SMTP_PORT || (host.includes("gmail") ? 465 : 587)
);
const secure =
  String(process.env.SMTP_SECURE || port === 465).toLowerCase() === "true" ||
  port === 465;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: {
    user,
    pass,
  },
});

module.exports = transporter;
