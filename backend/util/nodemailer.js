import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "87294a001@smtp-brevo.com",
    pass: "CsNWDyXnzqUY6SGa",
  },
});

export default transporter;
