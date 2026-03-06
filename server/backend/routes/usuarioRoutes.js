import express from "express";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import db from "../../db.js";
import { validarRegistro, validarLogin } from "../validations/usuarioValidation.js";
import { uploadPerfil } from "../middlewares/uploadPerfil.js";
import { sendWelcomeEmail } from "../services/emailService.js";
import { getPerfilCompleto } from "../controllers/usuarioController.js";

const router = express.Router();

// seguir a un usuario
router.post("/seguir", async (req, res) => {
  try {
    const { seguidor, seguido } = req.body;

    if (seguidor === seguido) {
      return res.status(400).json({ error: "No puedes seguirte a ti mismo" });
    }

    const [exists] = await db.query(
      "SELECT id_seguimiento FROM seguidores WHERE email_seguidor = ? AND email_seguido = ?",
      [seguidor, seguido]
    );

    if (exists.length > 0) {
      return res.status(400).json({ error: "Ya sigues a este usuario" });
    }

    await db.query(
      "INSERT INTO seguidores (email_seguidor, email_seguido) VALUES (?, ?)",
      [seguidor, seguido]
    );

    await db.query(
      `INSERT INTO notificaciones
      (email_destino,email_origen,tipo)
      VALUES (?,?,?)`,
      [seguido, seguidor, "seguir"]
      );

    res.json({ message: "Ahora sigues a este usuario" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al seguir usuario" });
  }
});

// dejar de seguir a un usuario
router.delete("/dejar-seguir", async (req, res) => {
  try {
    const { seguidor, seguido } = req.body;

    await db.query(
      "DELETE FROM seguidores WHERE email_seguidor = ? AND email_seguido = ?",
      [seguidor, seguido]
    );

    res.json({ message: "Dejaste de seguir al usuario" });

  } catch (error) {
    res.status(500).json({ error: "Error al dejar de seguir" });
  }
});

// verificar si un usuario sigue a otro
router.get("/sigo", async (req, res) => {
  try {
    const { seguidor, seguido } = req.query;

    const [rows] = await db.query(
      "SELECT id_seguimiento FROM seguidores WHERE email_seguidor = ? AND email_seguido = ?",
      [seguidor, seguido]
    );

    res.json({ siguiendo: rows.length > 0 });

  } catch (error) {
    console.error("Error en sigo:", error);
    res.status(500).json({ error: "Error verificando seguimiento" });
  }
});

// --- CONSULTAS ---
router.get("/perfil-completo/:email", getPerfilCompleto);

// Buscar usuarios por username o nombre
router.get("/buscar", async (req, res) => {
  try {
    const { q, currentEmail } = req.query;

    if (!q || q.trim() === "") {
      return res.json([]);
    }

    const search = `${q}%`;

    let sql = `
      SELECT email, username, nombre, foto_perfil
      FROM usuarios
      WHERE (username LIKE ? OR nombre LIKE ?)
    `;

    const params = [search, search];

    if (currentEmail) {
      sql += ` AND email != ?`;
      params.push(currentEmail);
    }

    sql += ` ORDER BY username ASC LIMIT 10`;

    const [usuarios] = await db.query(sql, params);

    res.json(usuarios);

  } catch (error) {
    console.error("Error buscando usuarios:", error);
    res.status(500).json({ error: "Error en búsqueda" });
  }
});

router.get("/:email", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT email, nombre, username, foto_perfil, bio, ciudad, departamento FROM usuarios WHERE email = ?",
      [req.params.email]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
    
    const usuario = rows[0];
    res.json({
      ...usuario,
      bio: usuario.bio || "",
      foto_perfil: usuario.foto_perfil || "/uploads/perfiles/default.png"
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error servidor" });
  }
});

// --- AUTENTICACIÓN (Registro y Login) ---
router.post("/register", validarRegistro, async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });

  const { nombre, email, contrasena, username, telefono, genero, departamento, ciudad, fecha_nacimiento } = req.body;
  
  try {
    // Verificar si existe
    const [existing] = await db.query("SELECT * FROM usuarios WHERE email = ? OR username = ?", [email, username]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "El correo o nombre de usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);
    
    await db.query(
      `INSERT INTO usuarios (nombre, email, contrasena, username, telefono, genero, departamento, ciudad, fecha_nacimiento, provider) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, email, hashedPassword, username, telefono, genero, departamento, ciudad, fecha_nacimiento, "local"]
    );

    // Intento de envío de correo (sin bloquear el registro)
    try {
      await sendWelcomeEmail(email, nombre);
    } catch (mailError) {
      console.error("Error al enviar correo de bienvenida:", mailError);
    }

    res.json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/login", validarLogin, async (req, res) => {
  const { email, contrasena } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    const usuario = rows[0];
    if (usuario.provider === "google") return res.status(400).json({ error: "Usa Google Login" });

    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordValida) return res.status(401).json({ error: "Contraseña incorrecta" });

    res.json({
      mensaje: "Inicio de sesión exitoso",
      usuario: { email: usuario.email, nombre: usuario.nombre, username: usuario.username },
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
});

// --- ACTUALIZACIONES ---
router.post("/foto-perfil", uploadPerfil.single("foto"), async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !req.file) return res.status(400).json({ message: "Datos incompletos" });

    const ruta = `/uploads/perfiles/${req.file.filename}`;
    await db.query("UPDATE usuarios SET foto_perfil = ? WHERE email = ?", [ruta, email]);
    res.json({ message: "Foto actualizada correctamente", foto_perfil: ruta });
  } catch (error) {
    res.status(500).json({ message: "Error al subir foto" });
  }
});

router.put("/actualizar", async (req, res) => {
  try {
    const { email, nombre, bio, username, telefono, genero, departamento, ciudad, fecha_nacimiento } = req.body;
    
    if (!email) return res.status(400).json({ error: "Email es requerido" });

    await db.query(
      `UPDATE usuarios SET 
        nombre = ?, bio = ?, username = ?, telefono = ?, 
        genero = ?, departamento = ?, ciudad = ?, fecha_nacimiento = ? 
      WHERE email = ?`,
      [nombre, bio, username, telefono, genero, departamento, ciudad, fecha_nacimiento, email]
    );
    res.json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/seguidores/:email", async (req, res) => {
  const { email } = req.params;

  const [rows] = await db.query(`
    SELECT u.email, u.username, u.nombre, u.foto_perfil
    FROM seguidores s
    JOIN usuarios u ON s.email_seguidor = u.email
    WHERE s.email_seguido = ?
  `, [email]);

  res.json(rows);
});


router.get("/seguidos/:email", async (req, res) => {
  const { email } = req.params;

  const [rows] = await db.query(`
    SELECT u.email, u.username, u.nombre, u.foto_perfil
    FROM seguidores s
    JOIN usuarios u ON s.email_seguido = u.email
    WHERE s.email_seguidor = ?
  `, [email]);

  res.json(rows);
});

export default router;