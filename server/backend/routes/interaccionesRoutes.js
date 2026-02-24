import express from "express";
import pool from "../../db.js";
import { io } from "../../index.js";

const router = express.Router();

// ===============================
// OBTENER COMENTARIOS DE UN POST
// ===============================
router.get("/:id/comentarios", async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(
            `SELECT * FROM interacciones 
                WHERE id_publicacion = ? 
                AND tipo_interaccion = 'comentario'
                ORDER BY fecha_interaccion DESC`,
            [id]
        );

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener comentarios" });
    }
});

// ===============================
// CREAR INTERACCIÓN (comentario)
// ===============================
router.post("/", async (req, res) => {
    const { email, id_publicacion, tipo_interaccion, comentario } = req.body;

    try {
        await pool.query(
            `INSERT INTO interacciones 
            (email, id_publicacion, tipo_interaccion, comentario)
            VALUES (?, ?, ?, ?)`,
            [email, id_publicacion, tipo_interaccion, comentario]
        );

        // 🔥 EMITIR EVENTO EN TIEMPO REAL
        // io.emit("post_updated", {
        // id_publicacion,
        // tipo_interaccion,
        // action: "add"
        // });

        io.emit("post_updated", {
        id_publicacion,
        tipo_interaccion,
        action: "add",
        email
        });

        res.json({ message: "Interacción creada" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear interacción" });
    }
});

router.delete("/", async (req, res) => {
    const { email, id_publicacion, tipo_interaccion } = req.body;

    try {
        await pool.query(
        `DELETE FROM interacciones 
        WHERE email = ? 
        AND id_publicacion = ? 
        AND tipo_interaccion = ?`,
        [email, id_publicacion, tipo_interaccion]
        );

        // 🔥 Emitir eliminación
        // io.emit("post_updated", {
        // id_publicacion,
        // tipo_interaccion,
        // action: "remove"
        // });

        io.emit("post_updated", {
        id_publicacion,
        tipo_interaccion,
        action: "remove",
        email
        });

        res.json({ message: "Interacción eliminada" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar interacción" });
    }
});



export default router;