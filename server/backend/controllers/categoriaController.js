import { pool } from "../../db.js";

export const obtenerCategorias = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM categorias");
  res.json(rows);
};
