import multer from "multer";
import path from "path";
import fs from "fs";

// Ruta absoluta correcta
const uploadDir = path.resolve("uploads/publicaciones");

// Crear carpeta si no existe
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(" Carpeta publicaciones creada:", uploadDir);
}

const storagePublicaciones = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

        cb(null, uniqueName + path.extname(file.originalname));
    },
});

export const uploadPublicacion = multer({
    storage: storagePublicaciones
});
