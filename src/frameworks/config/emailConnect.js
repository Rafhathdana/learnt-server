const nodemailer = require("nodemailer");
const EMAILOTP = async (email, subject, text, html) => {
  return new Promise(async (resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL,
        pass: process.env.MAILPASS,
      },
    });

    let message = {
      from: process.env.MAIL,
      to: email,
      subject: subject,
      text: text,
      html: html,
    };

    transporter.sendMail(message, function (error, info) {
      if (error) {
        console.log("error");
        reject({ Success: false });
      } else {
        resolve({ Success: true });
      }
    });
  });
};
module.exports = EMAILOTP;
