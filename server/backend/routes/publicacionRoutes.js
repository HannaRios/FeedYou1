// server/backend/routes/publicacionRoutes.js
import express from "express";
import pool from "../../db.js";
import { crearPublicacionController, obtenerPublicacionesController, obtenerTrending } from "../controllers/publicacionController.js";


import { uploadPublicacion as upload, uploadPublicacion } from "../middlewares/uploadPublicacion.js";

const router = express.Router();
//crear publicaciones
router.post("/", uploadPublicacion.single("archivo"), crearPublicacionController);
//obtener publicaciones
router.get("/", obtenerPublicacionesController);
// obtener trendig
router.get("/trending/:email", obtenerTrending);

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const { email } = req.query; 

    try {

        const [rows] = await pool.query(
            `
            SELECT 
                u.foto_perfil,
                u.username AS username_autor,
                u.nombre AS nombre_autor,
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
            WHERE p.id_publicacion = ?
            GROUP BY p.id_publicacion
            `,
            [email || null, email || null, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Publicación no encontrada" });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error obteniendo publicación" });
    }
});

// NUEVO: Eliminar publicación por ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const { email } = req.body; 

    if (!email) return res.status(400).json({ message: "Email requerido para borrar" });

    try {
        // Verificar existencia y propiedad
        const [pub] = await pool.query("SELECT * FROM publicaciones WHERE id_publicacion = ?", [id]);
        if (pub.length === 0) return res.status(404).json({ message: "No encontrada" });
        if (pub[0].email_autor !== email) return res.status(403).json({ message: "No autorizado" });

        // Intentar borrar dependencias si no hay ON DELETE CASCADE
        await pool.query("DELETE FROM notificaciones WHERE id_publicacion = ?", [id]);
        await pool.query("DELETE FROM interacciones WHERE id_publicacion = ?", [id]);
        await pool.query("DELETE FROM denuncias WHERE id_publicacion = ?", [id]).catch(e => console.log('Sin denuncias tabla:', e.message));

        // Borrar el post
        await pool.query("DELETE FROM publicaciones WHERE id_publicacion = ?", [id]);

        res.json({ message: "Publicación eliminada correctamente" });
    } catch (error) {
        console.error("Error borrando publicacion:", error);
        res.status(500).json({ message: "Error interno eliminando publicación" });
    }
});

export default router;
