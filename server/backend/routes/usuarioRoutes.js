import express from "express";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import db from "../../db.js";
import { validarRegistro, validarLogin } from "../validations/usuarioValidation.js";
import { uploadPerfil } from "../middlewares/uploadPerfil.js";
import { sendWelcomeEmail } from "../services/emailService.js";
import { getPerfilCompleto } from "../controllers/usuarioController.js";

const router = express.Router();
// --- GESTIÓN DE USUARIOS ---
router.get("/lista", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT nombre, email, rol, estado FROM usuarios");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// --- MODERACIÓN DE CONTENIDO (GET) ---
router.get("/admin/moderacion-pendientes", async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id_publicacion, 
        p.titulo,
        p.descripcion AS contenido, 
        p.url_media AS imagen_url, 
        u.nombre AS autor, 
        d.motivo, 
        d.id_denuncia
      FROM publicaciones p
      INNER JOIN denuncias d ON p.id_publicacion = d.id_publicacion
      INNER JOIN usuarios u ON p.email_autor = u.email
      WHERE d.estado_denuncia = 'pendiente'
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error en moderación" });
  }
});

// --- DENUNCIAS (GET - Una sola vez) ---
router.get("/admin/denuncias", async (req, res) => {
  try {
    const query = `
      SELECT 
        d.id_denuncia, d.motivo, d.estado_denuncia, d.fecha_denuncia,
        u1.nombre AS denunciante, u2.nombre AS acusado 
      FROM denuncias d
      LEFT JOIN usuarios u1 ON d.email_emisor = u1.email
      LEFT JOIN usuarios u2 ON d.email_acusado = u2.email
      ORDER BY d.fecha_denuncia DESC`;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener denuncias" });
  }
});

// --- ACCIONES DE MODERACIÓN (DELETE / PUT) ---

// ELIMINAR PUBLICACIÓN
router.delete("/admin/eliminar-publicacion/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // El id llega como string, lo usamos directamente en el query
    const [result] = await db.query("DELETE FROM publicaciones WHERE id_publicacion = ?", [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }
    res.json({ message: "Publicación eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar:", error);
    res.status(500).json({ error: "Error interno al eliminar" });
  }
});

// DESCARTAR DENUNCIA
router.put("/admin/descartar-denuncia/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("UPDATE denuncias SET estado_denuncia = 'rechazada' WHERE id_denuncia = ?", [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Denuncia no encontrada" });
    }
    res.json({ message: "Denuncia descartada" });
  } catch (error) {
    console.error("Error al descartar:", error);
    res.status(500).json({ error: "Error interno al descartar" });
  }
});
// --- AUTENTICACIÓN ---
router.post("/register", validarRegistro, async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });

  const { nombre, email, contrasena } = req.body;
  try {
    const [existing] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (existing.length > 0) return res.status(400).json({ error: "El correo ya está registrado" });

    const hashedPassword = await bcrypt.hash(contrasena, 10);
    await db.query(
      "INSERT INTO usuarios (nombre, email, contrasena, provider) VALUES (?, ?, ?, ?)",
      [nombre, email, hashedPassword, "local"]
    );

    try { await sendWelcomeEmail(email, nombre); } catch (e) {}
    res.json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
});

// --- AUTENTICACIÓN ---
router.post("/login", validarLogin, async (req, res) => {
  const { email, contrasena } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    const usuario = rows[0];

    // 2. VERIFICACIÓN DE BLOQUEO
    if (usuario.estado === 'baneado' || usuario.estado === 'suspendido') {
      return res.status(403).json({ 
        error: "Tu cuenta ha sido bloqueada o suspendida por infracción de normas." 
      });
    }

    if (usuario.provider === "google") return res.status(400).json({ error: "Usa Google Login" });

    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordValida) return res.status(401).json({ error: "Contraseña incorrecta" });

    res.json({
      mensaje: "Inicio de sesión exitoso",
      usuario: { 
        email: usuario.email, 
        nombre: usuario.nombre,
        rol: usuario.rol 
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// --- ACTUALIZACIONES ---
router.post("/foto-perfil", uploadPerfil.single("foto"), async (req, res) => {
  try {
    const { email } = req.body;
    const ruta = `/uploads/perfiles/${req.file.filename}`;
    await db.query("UPDATE usuarios SET foto_perfil = ? WHERE email = ?", [ruta, email]);
    res.json({ message: "Foto actualizada", foto_perfil: ruta });
  } catch (error) {
    res.status(500).json({ message: "Error al subir foto" });
  }
});

router.put("/actualizar", async (req, res) => {
  try {
    const { email, nombre, bio, username, telefono, genero, departamento, ciudad, fecha_nacimiento } = req.body;
    await db.query(
      `UPDATE usuarios SET 
        nombre = ?, bio = ?, username = ?, telefono = ?, 
        genero = ?, departamento = ?, ciudad = ?, fecha_nacimiento = ? 
      WHERE email = ?`,
      [nombre, bio, username, telefono, genero, departamento, ciudad, fecha_nacimiento, email]
    );
    res.json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para que el admin bloquee o desbloquee usuarios
router.put("/actualizar-estado", async (req, res) => {
  const { email, nuevoEstado } = req.body; 

  try {
    const [result] = await db.query(
      "UPDATE usuarios SET estado = ? WHERE email = ?",
      [nuevoEstado, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ mensaje: `Usuario ${email} ahora está ${nuevoEstado}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el estado" });
  }
});

// --- NUEVO: RECIBIR DENUNCIA DESDE EL POSTCARD ---
router.post("/denunciar-publicacion", async (req, res) => {
  const { email_emisor, email_acusado, id_publicacion, motivo, comentario_adicional } = req.body;
  try {
    const query = `
      INSERT INTO denuncias (email_emisor, email_acusado, id_publicacion, motivo, comentario_adicional, estado_denuncia, fecha_denuncia)
      VALUES (?, ?, ?, ?, ?, 'pendiente', NOW())
    `;
    await db.query(query, [email_emisor, email_acusado, id_publicacion, motivo, comentario_adicional]);
    res.json({ mensaje: "Denuncia registrada correctamente" });
  } catch (error) {
    console.error("Error al registrar denuncia:", error);
    res.status(500).json({ error: "Error al procesar la denuncia" });
  }
});

// --- OBTENER PERFIL POR EMAIL (Para el Navbar y otros) ---
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const [rows] = await db.query(
      "SELECT nombre, email, foto_perfil, rol, bio, estado FROM usuarios WHERE email = ?", 
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el perfil" });
  }
});

// --- OBTENER PERFIL POR EMAIL (Para que el Navbar no de error 404) ---
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const [rows] = await db.query(
      "SELECT nombre, email, foto_perfil, rol, bio, estado FROM usuarios WHERE email = ?", 
      [email]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el perfil" });
  }
});

// --- OBTENER PERFIL COMPLETO (LA LÍNEA QUE PREGUNTASTE) ---
router.get("/perfil-completo/:email", getPerfilCompleto);

// --- NUEVO: RUTA PARA DENUNCIAS ---
router.post("/denunciar-publicacion", async (req, res) => {
  const { email_emisor, email_acusado, id_publicacion, motivo, comentario_adicional } = req.body;
  try {
    const query = `
      INSERT INTO denuncias (email_emisor, email_acusado, id_publicacion, motivo, comentario_adicional, estado_denuncia, fecha_denuncia)
      VALUES (?, ?, ?, ?, ?, 'pendiente', NOW())
    `;
    await db.query(query, [email_emisor, email_acusado, id_publicacion, motivo, comentario_adicional]);
    res.json({ mensaje: "Denuncia registrada correctamente" });
  } catch (error) {
    console.error("Error al registrar denuncia:", error);
    res.status(500).json({ error: "Error al procesar la denuncia" });
  }
});

// --- ESTADÍSTICAS PARA EL DASHBOARD ---
router.get("/stats/registros", async (req, res) => {
  try {
    const query = `
      SELECT DATE_FORMAT(fecha_registro, '%d %b') AS fecha, COUNT(*) AS cantidad
      FROM usuarios 
      WHERE fecha_registro >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY fecha, fecha_registro
      ORDER BY fecha_registro ASC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error en SQL Registros:", error.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// 2. Categorías más usadas
router.get("/stats/categorias", async (req, res) => {
  try {
    const query = `
      SELECT c.nombre_categoria AS categoria, COUNT(p.id_publicacion) AS total 
      FROM publicaciones p
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      GROUP BY c.nombre_categoria
      ORDER BY total DESC 
      LIMIT 5
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error en SQL Categorías:", error.message);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
});

// --- PERFIL POR EMAIL (UNA SOLA VEZ) ---
router.get("/perfil/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const [rows] = await db.query(
      "SELECT nombre, email, foto_perfil, rol, bio, estado FROM usuarios WHERE email = ?", 
      [email]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el perfil" });
  }
});

// --- PERFIL COMPLETO ---
router.get("/perfil-completo/:email", getPerfilCompleto);

export default router;