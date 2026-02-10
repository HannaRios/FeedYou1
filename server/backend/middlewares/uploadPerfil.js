import multer from "multer";
import path from "path";
import fs from "fs";

// asegurar carpeta
const dir = "uploads/perfiles";
    if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    }

    const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const nombre = `perfil-${Date.now()}${ext}`;
        cb(null, nombre);
    },
    });

    export const uploadPerfil = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image")) {
        cb(new Error("Solo imágenes"));
        }
        cb(null, true);
    },
    });
