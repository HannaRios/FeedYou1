// server/backend/routes/publicacionRoutes.js
import express from "express";
import { crearPublicacionController } from "../controllers/publicacionController.js";
import { uploadPublicacion as upload, uploadPublicacion } from "../middlewares/uploadPublicacion.js";

const router = express.Router();

router.post("/", uploadPublicacion.single("archivo"), crearPublicacionController);

// GET de prueba
router.get("/", (req, res) => {
  res.json({ mensaje: "Ruta de publicaciones OK" });
});

export default router;
