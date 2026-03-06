import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  //Create a Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  //Define the email options
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    html: options.text,
  };

  //Send the email
  const info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
};

export default sendEmail;
