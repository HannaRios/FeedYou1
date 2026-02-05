import express from "express";
import db from "../../db.js";

const router = express.Router();

// TODAS las categorías (para crear publicación)
    router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query(
        "SELECT id_categoria AS id, nombre_categoria AS nombre FROM categorias"
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener categorías" });
    }
    });

    // TODAS las subcategorías de una categoría
    router.get("/:id/subcategorias", async (req, res) => {
    try {
        const [rows] = await db.query(
        "SELECT id_subcategoria AS id, nombre_subcategoria AS nombre FROM subcategorias WHERE id_categoria = ?",
        [req.params.id]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener subcategorías" });
    }
    });

    export default router;
