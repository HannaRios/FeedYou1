import db from "../../db.js";

export const feedParaTi = async (req, res) => {
  try {
    const { email } = req.params;

const [feed] = await db.query(
    `
    SELECT 
      u.foto_perfil,
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
    JOIN usuarios u
      ON p.email_autor = u.email
    LEFT JOIN interacciones i
      ON p.id_publicacion = i.id_publicacion

    WHERE p.estado = 'aprobado'
    AND p.id_subcategoria IN (
      SELECT id_subcategoria
      FROM preferencias_test
      WHERE email = ?
    )

    GROUP BY p.id_publicacion
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