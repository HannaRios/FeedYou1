import express from "express";
import pool from "../../db.js";
import { io } from "../../index.js";
import { obtenerComentarios, obtenerFavoritos } from "../controllers/interaccionesController.js";

const router = express.Router();


router.get("/:id/comentarios", async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(
            `
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
            `,
            [id]
        );

        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener comentarios" });
    }
});

// ===============================
// OBTENER FAVORITOS DE UN USUARIO
// ===============================
router.get("/favoritos/:email", async (req, res) => {
    const { email } = req.params;

    try {
        const [rows] = await pool.query(
            `
            SELECT 
                u.foto_perfil,
                p.*,

                COUNT(CASE WHEN i.tipo_interaccion = 'me_gusta' THEN 1 END) AS total_likes,
                COUNT(CASE WHEN i.tipo_interaccion = 'comentario' THEN 1 END) AS total_comentarios,
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
            AND p.id_publicacion IN (
                SELECT id_publicacion 
                FROM interacciones 
                WHERE email = ? 
                AND tipo_interaccion = 'favorito'
            )

            GROUP BY p.id_publicacion
            ORDER BY p.fecha_publicacion DESC
            `,
            [email, email, email]
        );

        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener favoritos" });
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

        // EMITIR EVENTO EN TIEMPO REAL
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

// ===============================
// ELIMINAR COMENTARIO POR ID
// ===============================
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query(
        "DELETE FROM interacciones WHERE id_interaccion = ? AND tipo_interaccion = 'comentario'",
        [id]
        );

        res.json({ message: "Comentario eliminado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error eliminando comentario" });
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

        // Emitir eliminación
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