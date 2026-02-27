export const obtenerFavoritos = async (req, res) => {
  const { email } = req.params;

  try {
    const query = `
      SELECT p.*
      FROM publicaciones p
      INNER JOIN interacciones i 
        ON p.id_publicacion = i.id_publicacion
      WHERE i.email = ?
      AND i.tipo_interaccion = 'favorito'
      AND p.estado = 'aprobado'
      ORDER BY p.fecha_publicacion DESC
    `;

    const [rows] = await db.query(query, [email]);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo favoritos" });
  }
};

export const obtenerComentarios = async (req, res) => {
  const { id_publicacion } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT 
        i.id_interaccion,
        i.email,
        i.comentario,
        i.fecha_interaccion,
        u.foto_perfil
      FROM interacciones i
      JOIN usuarios u ON i.email = u.email
      WHERE i.id_publicacion = ?
      AND i.tipo_interaccion = 'comentario'
      ORDER BY i.fecha_interaccion ASC
    `, [id_publicacion]);

    res.json(rows);

  } catch (error) {
    console.error("Error obteniendo comentarios:", error);
    res.status(500).json({ error: "Error obteniendo comentarios" });
  }
};

