import axios from "axios";
import db from "../../db.js";
import "dotenv/config";

export async function getFeed(req, res) {
  const email = req.params.email || req.query.email || req.body.email;

  if (!email) {
    return res.status(400).json({ error: "Email es requerido" });
  }

  try {
const [feed] = await db.query(
`
SELECT 
  p.*,
  u.username AS username_autor,
  u.nombre AS nombre_autor,
  u.foto_perfil,

  COUNT(CASE WHEN i.tipo_interaccion = 'me_gusta' THEN 1 END) AS total_likes,
  COUNT(CASE WHEN i.tipo_interaccion = 'favorito' THEN 1 END) AS total_favoritos,

  MAX(CASE 
      WHEN i.tipo_interaccion = 'me_gusta' 
      AND i.email = ? 
      THEN 1 ELSE 0 
  END) AS user_liked,

  MAX(CASE 
      WHEN i.tipo_interaccion = 'favorito' 
      AND i.email = ? 
      THEN 1 ELSE 0 
  END) AS user_favorited

FROM publicaciones p
JOIN usuarios u ON p.email_autor = u.email
LEFT JOIN interacciones i ON p.id_publicacion = i.id_publicacion

WHERE p.estado = 'aprobado'

GROUP BY p.id_publicacion, u.username, u.nombre, u.foto_perfil
ORDER BY p.fecha_publicacion DESC
`,
[email, email]
);

    res.json(feed);
  } catch (error) {
    console.error("Error al obtener feed:", error);
    res.status(500).json({ message: "Error al cargar el feed" });
  }
}

export const feedParaTi = async (req, res) => {
  const email = req.params.email || req.query.email || req.body.email;

  if (!email) {
    return res.status(400).json({ error: "Email es requerido" });
  }

  try {
    const [rows] = await db.query(
      `
      SELECT s.nombre_subcategoria
      FROM preferencias_test pt
      JOIN subcategorias s 
        ON pt.id_subcategoria = s.id_subcategoria
      WHERE pt.email = ?
      `,
      [email]
    );


    if (rows.length === 0) {
      return res.status(400).json({ error: "Usuario sin preferencias" });
    }

    const mapToNewsAPI = {
      "libros y novelas": "entertainment",
      "cine y películas": "entertainment",
      "series y tv": "entertainment",
      "música y conciertos": "entertainment",
      videojuegos: "technology",
      "moda y estilo": "entertainment",
    };

    const categoriesArray = rows
      .map((row) => mapToNewsAPI[row.nombre_subcategoria.toLowerCase()])
      .filter(Boolean);

    if (categoriesArray.length === 0) {
      categoriesArray.push("entertainment");
    }

    const uniqueCategories = [...new Set(categoriesArray)];

    const promises = uniqueCategories.map((category) =>
      axios.get("https://newsapi.org/v2/top-headlines", {
        params: {
          category,
          language: "es",
          pageSize: 5,
          apiKey: process.env.NEWS_API_KEY,
        },
      })
    );

    

    await Promise.all(promises);


    const [feed] = await db.query(
      `
      SELECT 
        u.foto_perfil,
        u.username AS username_autor,
        u.nombre AS nombre_autor,
        p.id_publicacion,
        p.email_autor,
        p.titulo,
        p.descripcion,
        p.tipo,
        p.url_media,
        p.enlace_externo,
        p.fecha_publicacion,

        COUNT(CASE WHEN i.tipo_interaccion = 'me_gusta' THEN 1 END) AS total_likes,
        COUNT(CASE WHEN i.tipo_interaccion = 'comentario' THEN 1 END) AS total_comentarios,
        COUNT(CASE WHEN i.tipo_interaccion = 'compartir' THEN 1 END) AS total_compartidos,
        COUNT(CASE WHEN i.tipo_interaccion = 'favorito' THEN 1 END) AS total_favoritos,

        MAX(CASE 
            WHEN i.tipo_interaccion = 'me_gusta' 
            AND i.email = ? 
            THEN 1 ELSE 0 
        END) AS user_liked,

        MAX(CASE 
            WHEN i.tipo_interaccion = 'favorito' 
            AND i.email = ? 
            THEN 1 ELSE 0 
        END) AS user_favorited

      FROM publicaciones p
      JOIN usuarios u ON p.email_autor = u.email
      LEFT JOIN interacciones i ON p.id_publicacion = i.id_publicacion

      WHERE p.estado = 'aprobado'
      AND p.id_subcategoria IN (
        SELECT id_subcategoria
        FROM preferencias_test
        WHERE email = ?
      )

      GROUP BY p.id_publicacion, u.foto_perfil, u.username, u.nombre, p.email_autor, p.titulo, p.descripcion, p.tipo, p.url_media, p.enlace_externo, p.fecha_publicacion
      ORDER BY p.fecha_publicacion DESC
      `,
      [email, email, email]
    );

    res.json(feed);
  } catch (error) {
    console.error("Error feed Para Ti:", error);
    res.status(500).json({ message: "Error al cargar el feed Para Ti" });
  }
};


export const feedSeguidos = async (req, res) => {
  const email = req.params.email;

  if (!email) {
    return res.status(400).json({ error: "Email es requerido" });
  }

  try {

    const [rows] = await db.query(
      `
      SELECT 
        u.foto_perfil,
        u.username AS username_autor,
        u.nombre AS nombre_autor,

        p.id_publicacion,
        p.email_autor,
        p.titulo,
        p.descripcion,
        p.tipo,
        p.url_media,
        p.enlace_externo,
        p.fecha_publicacion,

        COUNT(CASE WHEN i.tipo_interaccion = 'me_gusta' THEN 1 END) AS total_likes,
        COUNT(CASE WHEN i.tipo_interaccion = 'comentario' THEN 1 END) AS total_comentarios,
        COUNT(CASE WHEN i.tipo_interaccion = 'favorito' THEN 1 END) AS total_favoritos,
        COUNT(CASE WHEN i.tipo_interaccion = 'compartir' THEN 1 END) AS total_compartidos,

        MAX(CASE 
            WHEN i.tipo_interaccion = 'me_gusta' 
            AND i.email = ? 
            THEN 1 ELSE 0 
        END) AS user_liked,

        MAX(CASE 
            WHEN i.tipo_interaccion = 'favorito' 
            AND i.email = ? 
            THEN 1 ELSE 0 
        END) AS user_favorited

      FROM publicaciones p

      JOIN usuarios u 
      ON p.email_autor = u.email

      LEFT JOIN interacciones i
      ON i.id_publicacion = p.id_publicacion

      WHERE p.email_autor COLLATE utf8mb4_unicode_ci IN (
        SELECT email_seguido COLLATE utf8mb4_unicode_ci FROM seguidores WHERE email_seguidor = ?
      )
      AND p.estado = 'aprobado'

      GROUP BY p.id_publicacion, u.foto_perfil, u.username, u.nombre, p.email_autor, p.titulo, p.descripcion, p.tipo, p.url_media, p.enlace_externo, p.fecha_publicacion

      ORDER BY p.fecha_publicacion DESC
      `,
      [email, email, email]
    );

    res.json(rows);

  } catch (error) {
    console.error("Error feed Seguidos:", error);
    res.status(500).json({ error: "Error cargando feed de seguidos", details: error.message || String(error) });
  }
};