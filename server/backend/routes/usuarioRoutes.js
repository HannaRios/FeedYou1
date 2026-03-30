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

    // 1. Cambiar estado de denuncias relacionadas
    await db.query(
      "UPDATE denuncias SET estado_denuncia = 'rechazada' WHERE id_publicacion = ?",
      [id]
    );

    // 2. Eliminar publicación
    const [result] = await db.query(
      "DELETE FROM publicaciones WHERE id_publicacion = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    res.json({ message: "Publicación eliminada y denuncia actualizada" });

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

    // Intento de envío de correo (en segundo plano y sin bloquear el registro)
    sendWelcomeEmail(email, nombre).catch(mailError => {
      console.error("Error en segundo plano al enviar correo de bienvenida:", mailError);
    });

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

router.get("/seguidores/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // Primero obtenemos los emails de los seguidores
    const [seguidoresRows] = await db.query(
      "SELECT email_seguidor FROM seguidores WHERE email_seguido = ?", 
      [email]
    );

    if (seguidoresRows.length === 0) {
      return res.json([]);
    }

    const emails = seguidoresRows.map(s => s.email_seguidor);
    const placeholders = emails.map(() => '?').join(',');

    // Luego buscamos los perfiles de esos usuarios evitando JOIN para sortear problemas de collation en bbdd
    const [rows] = await db.query(`
      SELECT email, username, nombre, foto_perfil
      FROM usuarios
      WHERE email IN (${placeholders})
    `, emails);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener seguidores:", error);
    res.status(500).json({ error: "Error en el servidor al obtener seguidores" });
  }
});


router.get("/seguidos/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // Primero obtenemos los emails q este usuario sigue
    const [seguidosRows] = await db.query(
      "SELECT email_seguido FROM seguidores WHERE email_seguidor = ?", 
      [email]
    );

    if (seguidosRows.length === 0) {
      return res.json([]);
    }

    const emails = seguidosRows.map(s => s.email_seguido);
    const placeholders = emails.map(() => '?').join(',');

    // Luego buscamos los perfiles
    const [rows] = await db.query(`
      SELECT email, username, nombre, foto_perfil
      FROM usuarios
      WHERE email IN (${placeholders})
    `, emails);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener seguidos:", error);
    res.status(500).json({ error: "Error en el servidor al obtener seguidos" });
  }
});

export default router;