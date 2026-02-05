import db from "../../db.js";

export const feedParaTi = async (req, res) => {
  try {
    const { email } = req.params;

    const [feed] = await db.query(
      `
      SELECT DISTINCT p.*
      FROM publicaciones p
      JOIN preferencias_test pt
        ON p.id_categoria = pt.id_categoria
        AND p.id_subcategoria = pt.id_subcategoria
      WHERE pt.email = ?
        AND p.estado = 'aprobado'
      ORDER BY p.fecha_publicacion DESC
      `,
      [email]
    );

    res.json(feed);
  } catch (error) {
    console.error("Error feed Para Ti:", error);
    res.status(500).json({ message: "Error al cargar el feed Para Ti" });
  }
};

