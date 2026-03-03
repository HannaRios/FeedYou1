import db from "../../db.js";
import bcrypt from "bcrypt";
import { sendWelcomeEmail } from "../services/emailService.js";

// Obtiene el perfil, posts, preferencias y seguidores en una sola llamada
export const getPerfilCompleto = async (req, res) => {
  const { email } = req.params;
  try {
    // 1. Datos básicos
    const [usuarios] = await db.query(
      "SELECT nombre, username, email, foto_perfil, bio, ciudad, departamento, telefono, genero FROM usuarios WHERE email = ?",
      [email]
    );

    if (usuarios.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
    const usuario = usuarios[0];

    // 2. Publicaciones
    const [posts] = await db.query(
      "SELECT * FROM publicaciones WHERE email_autor = ? ORDER BY fecha_publicacion DESC",
      [email]
    );

    // 3. Preferencias del Test
    const [prefs] = await db.query(`
      SELECT c.nombre_categoria, s.hashtag_subcategoria 
      FROM preferencias_test p
      JOIN categorias c ON p.id_categoria = c.id_categoria
      JOIN subcategorias s ON p.id_subcategoria = s.id_subcategoria
      WHERE p.email = ?`, 
      [email]
    );

    // 4. Estadísticas
    const [seguidores] = await db.query("SELECT COUNT(*) as total FROM seguidores WHERE email_seguido = ?", [email]);
    const [seguidos] = await db.query("SELECT COUNT(*) as total FROM seguidores WHERE email_seguidor = ?", [email]);

    res.json({
      user: usuario,
      posts: posts || [],
      preferencias: prefs || [],
      stats: {
        seguidores: seguidores[0]?.total || 0,
        seguidos: seguidos[0]?.total || 0,
        postCount: posts.length || 0
      }
    });
  } catch (error) {
    console.error("Error en getPerfilCompleto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Función auxiliar para insertar (usada por el registro)
export const insertarUsuario = async (datos) => {
  const { email, nombre, username, telefono, genero, departamento, ciudad, fecha_nacimiento, hash } = datos;
  return await db.query(
    `INSERT INTO usuarios (email, nombre, username, telefono, genero, departamento, ciudad, fecha_nacimiento, contrasena, provider) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [email, nombre, username, telefono, genero, departamento, ciudad, fecha_nacimiento, hash, "local"]
  );
};