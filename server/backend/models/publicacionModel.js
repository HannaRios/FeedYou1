import db from "../../db.js";

export const crearPublicacion = async (data) => {
    const sql = `
        INSERT INTO publicaciones
        (email_autor, id_categoria, id_subcategoria, titulo, descripcion, tipo, url_media, enlace_externo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        data.email_autor,
        data.id_categoria,
        data.id_subcategoria,
        data.titulo,
        data.descripcion,
        data.tipo,
        data.url_media,
        data.enlace_externo
    ];

    const [result] = await db.query(sql, values);
    return result;
};