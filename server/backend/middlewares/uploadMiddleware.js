// server/backend/middlewares/uploadMiddleware.js
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if ([".png", ".jpg", ".jpeg", ".gif", ".mp4", ".mov", ".webm"].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes y videos"));
  }
};

export const upload = multer({ storage, fileFilter });
