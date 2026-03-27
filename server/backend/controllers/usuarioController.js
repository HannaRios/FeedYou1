import db from "../../db.js";
import bcrypt from "bcrypt";
import { sendWelcomeEmail } from "../services/emailService.js";

// Obtiene el perfil, posts, preferencias y seguidores en una sola llamada
export const getPerfilCompleto = async (req, res) => {
  const { email } = req.params;
  const visitor = req.query.visitor || email;

  try {
    // 1. Datos básicos
    const [usuarios] = await db.query(
      "SELECT nombre, username, email, foto_perfil, bio, ciudad, departamento, telefono, genero FROM usuarios WHERE email = ?",
      [email]
    );

    if (usuarios.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
    const usuario = usuarios[0];

    // 2. Publicaciones
        let posts;
        if (visitor === email) {

        const [rows] = await db.query(
        `
        SELECT 
          p.*,
          u.username AS username_autor,
          u.nombre AS nombre_autor,
          u.foto_perfil,

          COUNT(CASE WHEN i.tipo_interaccion = 'me_gusta' THEN 1 END) AS total_likes,
          COUNT(CASE WHEN i.tipo_interaccion = 'favorito' THEN 1 END) AS total_favoritos,
          COUNT(CASE WHEN i.tipo_interaccion = 'comentario' THEN 1 END) AS total_comentarios

        FROM publicaciones p
        JOIN usuarios u ON p.email_autor = u.email
        LEFT JOIN interacciones i ON p.id_publicacion = i.id_publicacion

        WHERE p.email_autor = ?
        AND p.estado = 'aprobado'

        GROUP BY p.id_publicacion
        ORDER BY p.fecha_publicacion DESC
        `,
  [email]
);

    posts = rows;
    } else {
    const [rows] = await db.query(
    `
    SELECT 
      p.*,
      u.username AS username_autor,
      u.nombre AS nombre_autor,
      u.foto_perfil,

      COUNT(CASE WHEN i.tipo_interaccion = 'me_gusta' THEN 1 END) AS total_likes,
      COUNT(CASE WHEN i.tipo_interaccion = 'favorito' THEN 1 END) AS total_favoritos,
      COUNT(CASE WHEN i.tipo_interaccion = 'comentario' THEN 1 END) AS total_comentarios

    FROM publicaciones p
    JOIN usuarios u ON p.email_autor = u.email
    LEFT JOIN interacciones i ON p.id_publicacion = i.id_publicacion

    WHERE p.email_autor = ?
    AND p.estado = 'aprobado'
    AND p.id_subcategoria IN (
      SELECT id_subcategoria
      FROM preferencias_test
      WHERE email = ?
    )

    GROUP BY p.id_publicacion
    ORDER BY p.fecha_publicacion DESC
    `,
    [email, visitor]
    );

    posts = rows;

  }

    // 3. Preferencias del Test
    const [prefs] = await db.query(`
      SELECT c.nombre_categoria, s.hashtag_subcategoria 
      FROM preferencias_test p
      JOIN categorias c ON p.id_categoria = c.id_categoria
      JOIN subcategorias s ON p.id_subcategoria = s.id_subcategoria
      WHERE p.email = ?`, 
      [email]
    );

    // Estadísticas
    const [[seguidores]] = await db.query(
      "SELECT COUNT(*) as total FROM seguidores WHERE email_seguido = ?",
      [email]
    );

    const [[seguidos]] = await db.query(
      "SELECT COUNT(*) as total FROM seguidores WHERE email_seguidor = ?",
      [email]
    );

    res.json({
      user: usuario,
      posts: posts || [],
      preferencias: prefs || [],
      stats: {
        seguidores: seguidores.total || 0,
        seguidos: seguidos.total || 0,
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