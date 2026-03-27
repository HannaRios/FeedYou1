import express from "express";
import db from "../../db.js";

const router = express.Router();
        router.get("/:email", async (req,res)=>{

        const { email } = req.params;
        try{
        const [rows] = await db.query(`
        SELECT 
        n.*,
        u.username,
        u.foto_perfil,
        p.titulo
        FROM notificaciones n

        JOIN usuarios u
        ON u.email = n.email_origen

        LEFT JOIN publicaciones p
        ON p.id_publicacion = n.id_publicacion

        WHERE n.email_destino = ?

        ORDER BY n.fecha DESC
        `,[email]);

        res.json(rows);
        }catch(error){
        console.error(error);
        res.status(500).json({error:"error cargando notificaciones"});
        }
    });

export default router;