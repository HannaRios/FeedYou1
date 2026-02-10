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
    await db.query("INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)", [
      nombre,
      email,
      hashedPassword,
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
    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);

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

// ✅ Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const [usuarios] = await db.query("SELECT email, nombre, fecha_registro FROM usuarios");
    res.json({ usuarios });
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error.message);
    res.status(500).json({ error: "Error al obtener los usuarios" });
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


export default router;
