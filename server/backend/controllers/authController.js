import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendResetEmail } from "../services/emailService.js";
import db from "../../db.js";


export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(200).json({
        message: "Si el correo existe, recibirás un enlace."
      });
    }

    const user = rows[0];

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000);

    await db.query(
      "UPDATE usuarios SET reset_token = ?, reset_token_expires = ? WHERE email = ?",
      [resetToken, expires, user.email]
    );

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    await sendResetEmail(email, resetLink);

    res.json({ message: "Correo enviado correctamente" });

  } catch (error) {
    console.error("FORGOT ERROR:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const [rows] = await db.query(
      `SELECT * FROM usuarios 
       WHERE reset_token = ? 
       AND reset_token_expires > NOW()`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        error: "Token inválido o expirado"
      });
    }

    const user = rows[0];

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `UPDATE usuarios 
       SET contrasena = ?, 
           reset_token = NULL, 
           reset_token_expires = NULL
       WHERE email = ?`,
      [hashedPassword, user.email]
    );

    res.json({
      message: "Contraseña actualizada correctamente"
    });

  } catch (error) {
    console.error("RESET ERROR:", error);
    res.status(500).json({
      error: "Error interno del servidor"
    });
  }
};
