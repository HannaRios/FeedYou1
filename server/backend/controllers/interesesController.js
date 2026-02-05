import db from "../../db.js";

export const guardarIntereses = async (req, res) => {
    try {
        const { email, intereses } = req.body;

        if (!email || !Array.isArray(intereses)) {
        return res.status(400).json({ message: "Datos incompletos" });
        }

        //  borrar intereses anteriores (por si repite el test)
        await db.query(
        "DELETE FROM preferencias_test WHERE email = ?",
        [email]
        );

        //  insertar nuevos intereses
        for (const interes of intereses) {
        await db.query(
            `INSERT INTO preferencias_test (email, id_categoria, id_subcategoria)
            VALUES (?, ?, ?)`,
            [email, interes.id_categoria, interes.id_subcategoria]
        );
        }

        res.json({ message: "Intereses guardados correctamente " });
    } catch (error) {
        console.error("Error guardando intereses:", error);
        res.status(500).json({ message: "Error al guardar intereses" });
    }
};
