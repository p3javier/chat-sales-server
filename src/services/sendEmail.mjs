import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { MailtrapTransport } from "mailtrap";
dotenv.config();

var transporter = nodemailer.createTransport(
  MailtrapTransport({
    token: process.env.MAILTRAP_TOKEN,
  })
);

export const sendEmail = async ({ email, subject, body }) => {
  const mailOptions = {
    from: "support@demmo.xyz",
    to: email,
    subject: subject,
    text: body,
  };
  const sendMailResponse = await transporter.sendMail(mailOptions);
  console.log("sendMailResponse", sendMailResponse);
};

export const sendVerificationEmail = async (email, token) => {
  const subject = "AI Sales App - Confirmación de Registro";
  const body = `Bienvenido a AI Sales App.
  Para confirmar el registro y poder acceder a la demo haga clic en el siguiente enlace: ${process.env.CLIENT_ORIGIN}/?svid=ro9i8s4&authToken=${token}
  Muchas gracias por participar en la demo.
  Atentamente. Equipo de AI Sales App`;
  await sendEmail({ email, subject, body });
};
