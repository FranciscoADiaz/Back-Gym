const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org", 
  port: 587, 
  secure: false, 
  auth: {
    user: `${process.env.MAILGUN_USER}`,
    pass: `${process.env.MAILGUN_PASS}`,
  },
});

module.exports = transporter;
