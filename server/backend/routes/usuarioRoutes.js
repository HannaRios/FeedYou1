import express from "express";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import db from "../../db.js";
import { validarRegistro, validarLogin } from "../validations/usuarioValidation.js";
import { uploadPerfil } from "../middlewares/uploadPerfil.js";

const router = express.Router();

// 📌 Registrar usuario
router.post("/register", validarRegistro, async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { nombre, email, contrasena } = req.body;

  try {
    // Verificar si el email ya existe
    const [existing] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Guardar usuario
await db.query(
  "INSERT INTO usuarios (nombre, email, contrasena, provider) VALUES (?, ?, ?, ?)",
  [
    nombre,
    email,
    hashedPassword,
    "local"
  ]);

    res.json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("❌ Error al registrar:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// 📌 Login de usuario
router.post("/login", validarLogin, async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { email, contrasena } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuario = rows[0];

    // Evitar login normal en cuentas Google
    if (usuario.provider === "google") {

      return res.status(400).json({
        error: "Esta cuenta usa Google Login"
      });
    }

    const passwordValida = await bcrypt.compare(
      contrasena,
      usuario.contrasena
    );


    if (!passwordValida) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.json({
      mensaje: "Inicio de sesión exitoso",
      usuario: { email: usuario.email, nombre: usuario.nombre },
    });
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


// ✅ Obtener usuario por email
router.get("/:email", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT email, nombre, foto_perfil, bio FROM usuarios WHERE email = ?",
      [req.params.email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuario = rows[0];
    
    res.json({
      email: usuario.email,
      nombre: usuario.nombre,
      bio: usuario.bio || "",
      foto_perfil: usuario.foto_perfil || "/uploads/perfiles/default.png"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error servidor" });
  }
});



//  Subir / cambiar foto de perfil
router.post(
  "/foto-perfil",
  uploadPerfil.single("foto"),
  async (req, res) => {
    try {
      const { email } = req.body;

      if (!email || !req.file) {
        return res.status(400).json({ message: "Datos incompletos" });
      }

      const ruta = `/uploads/perfiles/${req.file.filename}`;

      await db.query(
        "UPDATE usuarios SET foto_perfil = ? WHERE email = ?",
        [ruta, email]
      );

      res.json({
        message: "Foto de perfil actualizada",
        foto_perfil: ruta,
      });
    } catch (error) {
      console.error("Error foto perfil:", error);
      res.status(500).json({ message: "Error al subir foto" });
    }
  }
);

router.put("/actualizar", async (req, res) => {

  try {

    console.log("BODY RECIBIDO:", req.body);

    const { email, nombre, bio } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email es requerido"
      });
    }

    const [result] = await db.query(
      "UPDATE usuarios SET nombre = ?, bio = ? WHERE email = ?",
      [nombre || "", bio || "", email]
    );

    console.log("RESULTADO:", result);

    res.json({
      message: "Perfil actualizado correctamente"
    });

  } catch (error) {

    console.error("ERROR ACTUALIZAR PERFIL:", error);

    res.status(500).json({
      error: error.message
    });

  }

});




export default router;
