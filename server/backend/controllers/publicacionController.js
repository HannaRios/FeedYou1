import { crearPublicacion } from "../models/publicacionModel.js";
import { obtenerPublicaciones } from "../models/publicacionModel.js";
import db from "../../db.js";

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

        // ✅ Verificar que el email del autor exista
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

        // ✅ Respuesta exitosa
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