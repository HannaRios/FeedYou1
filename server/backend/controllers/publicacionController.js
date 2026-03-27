import { crearPublicacion } from "../models/publicacionModel.js";
import { obtenerPublicaciones } from "../models/publicacionModel.js";
import db from "../../db.js";

export const obtenerTrending = async (req, res) => {
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
            p.fecha_publicacion,

            u.nombre AS nombre_autor,
            u.username AS username_autor,
            u.foto_perfil,

            COUNT(CASE WHEN i.tipo_interaccion = 'me_gusta' THEN 1 END) AS total_likes,
            COUNT(CASE WHEN i.tipo_interaccion = 'comentario' THEN 1 END) AS total_comentarios,
            COUNT(CASE WHEN i.tipo_interaccion = 'favorito' THEN 1 END) AS total_favoritos,
            COUNT(CASE WHEN i.tipo_interaccion = 'compartir' THEN 1 END) AS total_compartidos,

            COALESCE(SUM(
                CASE 
                    WHEN i.tipo_interaccion = 'me_gusta' THEN 2
                    WHEN i.tipo_interaccion = 'comentario' THEN 3
                    WHEN i.tipo_interaccion = 'favorito' THEN 2
                    WHEN i.tipo_interaccion = 'compartir' THEN 4
                    ELSE 0
                END
            ),0) AS score

            FROM publicaciones p

            JOIN usuarios u 
            ON u.email = p.email_autor

            LEFT JOIN interacciones i
            ON i.id_publicacion = p.id_publicacion

            WHERE p.id_categoria IN (
                SELECT DISTINCT id_categoria
                FROM preferencias_test
                WHERE email = ?
            )

            GROUP BY 
            p.id_publicacion,
            p.email_autor,
            u.nombre,
            u.username,
            u.foto_perfil
            ORDER BY 
            (score > 0) DESC,
            score DESC,
            p.fecha_publicacion DESC
            
            LIMIT 150
        `,[email]);

        res.json(rows);

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: "Error obteniendo tendencias" });

    }
};

export const crearPublicacionController = async (req, res) => {
    try {
        console.log("Archivo recibido:", req.file);
        console.log("Datos del body:", req.body);

        const {
            email_autor,
            id_categoria,
            id_subcategoria,
            titulo,
            descripcion,
            tipo,
            url_media,
            enlace_externo,
        } = req.body;

        // Validar campos obligatorios
        if (!email_autor || !titulo || !descripcion || !tipo) {
            return res.status(400).json({ message: "Faltan campos obligatorios" });
        }

        // Verificar que el email del autor exista
        const [usuario] = await db.query(
            "SELECT email FROM usuarios WHERE email = ?",
            [email_autor]
        );

        if (usuario.length === 0) {
            return res.status(400).json({ message: "El usuario no existe" });
        }


        const archivo = req.file ? req.file.filename : null;
        const media = req.file
            ? `/uploads/publicaciones/${req.file.filename}`
            : url_media || null;

        // Crear la publicación usando async/await
        const result = await crearPublicacion({
            email_autor,
            id_categoria,
            id_subcategoria,
            titulo,
            descripcion,
            tipo,
            url_media: media,
            enlace_externo,
        });

        // Respuesta exitosa
        res.status(201).json({
        message: "Publicación creada con éxito",
        id_publicacion: result.insertId,
        url_media: media,
        });

    } catch (error) {
        console.error("Error al crear publicación:", error);
        res.status(500).json({ message: "Error inesperado al crear la publicación" });
    }
};

export const obtenerPublicacionesController = async (req, res) => {
    try {

        const publicaciones = await obtenerPublicaciones();

        res.json(publicaciones);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al obtener publicaciones"
        });
    }
};