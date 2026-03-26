// controlador para el test de interes 

import db from "../../db.js";

// guardar preferencias del test
export const guardarPreferenciasTest = async (req, res) => {

    try {

        const { email, preferencias } = req.body;


        if (!preferencias || preferencias.length === 0) {
            return res.status(400).json({
                message: "No se recibieron preferencias"
            });
        }

        // eliminar preferencias anteriores (si existen)
        await db.query(
            "DELETE FROM preferencias_test WHERE email = ?",
            [email]
        );

        // insertar nuevas
        for (const pref of preferencias) {

            await db.query(`
                INSERT INTO preferencias_test
                (
                    email,
                    id_categoria,
                    id_subcategoria
                )
                VALUES (?, ?, ?)
            `, [
                email,
                pref.id_categoria,
                pref.id_subcategoria
            ]);

        }

        res.json({
            message: "Preferencias guardadas correctamente"
        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error al guardar preferencias"
        });

    }

};

// obtener preguntas del test
export const obtenerPreguntasTest = async (req, res) => {

    try {
        const [rows] = await db.query(`
            SELECT
                p.id_pregunta,
                c.id_categoria,
                c.nombre_categoria,
                s.id_subcategoria,
                s.nombre_subcategoria,
                p.texto_pregunta
            FROM preguntas p
            JOIN categorias c ON c.id_categoria = p.id_categoria
            JOIN subcategorias s ON s.id_subcategoria = p.id_subcategoria
            ORDER BY c.nombre_categoria, s.nombre_subcategoria
        `);

        res.json(rows);

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error al obtener preguntas"
        });

    }

};

// obtener subcategorias por categorias (para el test)
export const obtenerSubcategoriasPorCategorias = async (req, res) => {
    try {

        const { categorias } = req.body;

        if (!categorias || categorias.length === 0) {
        return res.status(400).json({
            message: "No se enviaron categorías"
        });
        }

        const [rows] = await db.query(`
        SELECT 
            id_subcategoria,
            id_categoria,
            nombre_subcategoria
        FROM subcategorias
        WHERE id_categoria IN (?)
        ORDER BY id_categoria, nombre_subcategoria
        `, [categorias]);

        res.json(rows);

    } catch (error) {

        console.error("Error obtener subcategorias:", error);

        res.status(500).json({
        message: "Error al obtener subcategorías"
        });

    }
};

export const obtenerPreferenciasUsuario = async (req, res) => {
    const { email } = req.params;

    try {

        const [rows] = await db.query(
        "SELECT id_categoria, id_subcategoria FROM preferencias_test WHERE email = ?",
        [email]
        );

        res.json(rows);

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: "Error obteniendo preferencias" });

    }

    };

