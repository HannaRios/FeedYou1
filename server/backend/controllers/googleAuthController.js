import { OAuth2Client } from "google-auth-library";
import db from "../../db.js"; 
import dotenv from "dotenv";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  const { token } = req.body;

  console.log("Token recibido en backend:", token);
  console.log("GOOGLE_CLIENT_ID backend:", process.env.GOOGLE_CLIENT_ID);

  if (!token) {
    return res.status(400).json({ error: "Token no proporcionado" });
  }

  let payload;
  try {
    console.log("Verificando token de Google...");
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    payload = ticket.getPayload();
    console.log("Token verificado. Payload:", payload);
  } catch (err) {
    console.error("Error verificando token:", err);
    return res.status(401).json({
      error: "Token inválido o expirado",
      details: err.message
    });
  }

  try {
    // Buscar usuario en la BD
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [payload.email]);

    let usuario;

    if (rows.length === 0) {
      // Usuario nuevo, crear en BD
      console.log("Usuario nuevo, creando en BD...");

      const [result] = await db.query(
        "INSERT INTO usuarios (email, nombre, contrasena) VALUES (?, ?, ?)",
        [
          payload.email,
          payload.name || "Sin nombre",
          "GOOGLE" 
        ]
      );

      usuario = {
        id: result.insertId,
        email: payload.email,
        nombre: payload.name || "Sin nombre"
      };

      console.log("✅ Usuario creado con ID:", usuario.id);
    } else {
      usuario = rows[0];
      console.log("✅ Usuario existente encontrado:", usuario);
    }

    // Responder al frontend
    return res.status(200).json({ success: true, user: usuario });

  } catch (err) {
    console.error("❌ Error en BD al procesar usuario:", err);
    return res.status(500).json({
      error: "Error en la base de datos al procesar login de Google",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
