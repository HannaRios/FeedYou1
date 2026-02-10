import multer from "multer";
import path from "path";

const storagePublicaciones = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/publicaciones");
    },
    filename: (req, file, cb) => {
        const uniqueName =
        Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    },
    });

export const uploadPublicacion = multer({ storage: storagePublicaciones });
