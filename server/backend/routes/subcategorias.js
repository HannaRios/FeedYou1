router.get("/:id_categoria", async (req, res) => {
  const { id_categoria } = req.params;
  const [rows] = await pool.query(
    "SELECT * FROM subcategorias WHERE id_categoria = ?",
    [id_categoria]
  );
  res.json(rows);
});
