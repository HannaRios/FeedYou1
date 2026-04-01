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
    const [rows] = await db.query(
      "SELECT email, nombre, provider, foto_perfil, username FROM usuarios WHERE email = ?",
      [payload.email]
    );

    let usuario;

    if (rows.length === 0) {
      // Usuario nuevo, crear en BD
      console.log("Usuario nuevo, creando en BD...");

      const [result] = await db.query(
        "INSERT INTO usuarios (email, nombre, contrasena, provider, foto_perfil) VALUES (?, ?, ?, ?, ?)",
        [
          payload.email,
          payload.name,
          "GOOGLE",
          "google",
          "/uploads/perfiles/default.png"
        ]
      );


    usuario = {
      email: payload.email,
      nombre: payload.name || "Sin nombre",
      provider: "google",
      foto_perfil: payload.picture || null,
      isProfileComplete: false
    };

      console.log("Usuario Google creado:", usuario.email);

} else {
  usuario = rows[0];

  if (!usuario.foto_perfil && payload.picture) {
    await db.query(
      "UPDATE usuarios SET foto_perfil = ? WHERE email = ?",
      [payload.picture, payload.email]
    );
    usuario.foto_perfil = payload.picture;
  }
  usuario.isProfileComplete = !!usuario.username;
  console.log("Usuario Google existente:", usuario.email);
}


    // Responder al frontend
return res.status(200).json({ 
  success: true, 
  user: {
    email: usuario.email,
    nombre: usuario.nombre,
    provider: usuario.provider,
    foto_perfil: usuario.foto_perfil || payload.picture || null,
    isProfileComplete: usuario.isProfileComplete
  }
});


  } catch (err) {
    console.error("Error DB Google Auth:", err);

    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
};
