export const obtenerFavoritos = async (req, res) => {
  const { email } = req.params;

  try {

    const [rows] = await db.query(`
      SELECT 
      p.id_publicacion,
      p.email_autor,
      p.id_categoria,
      p.id_subcategoria,
      p.titulo,
      p.descripcion,
      p.tipo,
      p.url_media,
      p.enlace_externo,
      p.fuente,
      p.es_noticia,
      p.estado,
      p.fecha_publicacion,

      u.nombre AS nombre_autor,
      u.username AS username_autor,
      u.foto_perfil,

      COUNT(CASE WHEN i2.tipo_interaccion = 'me_gusta' THEN 1 END) AS total_likes,
      COUNT(CASE WHEN i2.tipo_interaccion = 'comentario' THEN 1 END) AS total_comentarios,
      COUNT(CASE WHEN i2.tipo_interaccion = 'favorito' THEN 1 END) AS total_favoritos,

      MAX(CASE 
        WHEN i2.tipo_interaccion = 'me_gusta' AND i2.email = ? 
        THEN 1 ELSE 0 END) AS user_liked,

      MAX(CASE 
        WHEN i2.tipo_interaccion = 'favorito' AND i2.email = ? 
        THEN 1 ELSE 0 END) AS user_favorited

      FROM interacciones i

      JOIN publicaciones p
      ON p.id_publicacion = i.id_publicacion

      JOIN usuarios u
      ON u.email = p.email_autor

      LEFT JOIN interacciones i2
      ON i2.id_publicacion = p.id_publicacion

      WHERE i.email = ?
      AND i.tipo_interaccion = 'favorito'
      AND p.estado = 'aprobado'

      GROUP BY
      p.id_publicacion,
      u.nombre,
      u.username,
      u.foto_perfil

      ORDER BY p.fecha_publicacion DESC
    `,[email,email,email]);

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

export const toggleLike = async (req, res) => {
  const { email, id_publicacion } = req.body;

  try {

    const [existe] = await db.query(`
      SELECT id_interaccion
      FROM interacciones
      WHERE email = ?
      AND id_publicacion = ?
      AND tipo_interaccion = 'me_gusta'
    `, [email, id_publicacion]);

    if (existe.length > 0) {

      await db.query(`
        DELETE FROM interacciones
        WHERE id_interaccion = ?
      `, [existe[0].id_interaccion]);

      return res.json({ liked: false });

    }

    await db.query(`
      INSERT INTO interacciones
      (email, id_publicacion, tipo_interaccion)
      VALUES (?, ?, 'me_gusta')
    `, [email, id_publicacion]);

    res.json({ liked: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en like" });
  }
};

export const toggleFavorito = async (req, res) => {

  const { email, id_publicacion } = req.body;

  try {

    const [existe] = await db.query(`
      SELECT id_interaccion
      FROM interacciones
      WHERE email = ?
      AND id_publicacion = ?
      AND tipo_interaccion = 'favorito'
    `, [email, id_publicacion]);

    if (existe.length > 0) {

      await db.query(`
        DELETE FROM interacciones
        WHERE id_interaccion = ?
      `, [existe[0].id_interaccion]);

      return res.json({ favorito: false });

    }

    await db.query(`
      INSERT INTO interacciones
      (email, id_publicacion, tipo_interaccion)
      VALUES (?, ?, 'favorito')
    `, [email, id_publicacion]);

    res.json({ favorito: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en favorito" });
  }

};

export const agregarComentario = async (req, res) => {

  const { email, id_publicacion, comentario } = req.body;

  try {

    await db.query(`
      INSERT INTO interacciones
      (email, id_publicacion, tipo_interaccion, comentario)
      VALUES (?, ?, 'comentario', ?)
    `, [email, id_publicacion, comentario]);

    res.json({ message: "Comentario agregado" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Error agregando comentario" });

  }

};

export const compartirPublicacion = async (req, res) => {

  const { email, id_publicacion } = req.body;

  try {

    await db.query(`
      INSERT INTO interacciones
      (email, id_publicacion, tipo_interaccion)
      VALUES (?, ?, 'compartir')
    `, [email, id_publicacion]);

    res.json({ message: "Compartido" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Error compartiendo" });

  }

};