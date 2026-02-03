import express from "express";
import db from "../../db.js";
const router = express.Router();

// GET /api/categorias
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id_categoria AS id, nombre_categoria AS nombre FROM categorias"
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener categorías" });
    }
});

// GET /api/categorias/:id/subcategorias
router.get("/:id/subcategorias", async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(
            "SELECT id_subcategoria AS id, nombre_subcategoria AS nombre FROM subcategorias WHERE id_categoria = ?",
            [id]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener subcategorías" });
    }
});

export default router;
