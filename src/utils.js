import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export const __dirname = dirname(fileURLToPath(import.meta.url));

//BCRYPT
export const hashData = async (data) => {
  return bcrypt.hash(data, 10);
};

export const compareData = (data, hashedData) => {
  return bcrypt.compare(data, hashedData);
};


const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "tu_correo@gmail.com",
    pass: "tu_contraseña",
  },
});

export const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    const mailOptions = {
      from: "tu_correo@gmail.com",
      to: email,
      subject: "Restablecimiento de contraseña",
      text: `Haga clic en el siguiente enlace para restablecer su contraseña: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
    throw new Error("Error al enviar el correo electrónico");
  }
};