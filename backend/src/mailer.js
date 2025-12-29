const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",      // можно заменить на другой SMTP
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,   // твой email
    pass: process.env.EMAIL_PASS    // app password (для Gmail)
  },
});

const sendNotification = async (questionText) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.DOCTOR_EMAIL,  // email брата
      subject: "Новый вопрос от пациента",
      text: `Поступил новый вопрос:\n\n${questionText}`,
    });
    console.log("Notification sent");
  } catch (err) {
    console.error("Failed to send email:", err);
  }
};

module.exports = { sendNotification };
