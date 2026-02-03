// server/backend/routes/publicacionRoutes.js
import express from "express";
import { crearPublicacionController } from "../controllers/publicacionController.js";
import { upload } from "../middlewares/uploadMiddleware.js"; // <- importante

const router = express.Router();

router.post("/", upload.single("archivo"), crearPublicacionController);

// GET de prueba
router.get("/", (req, res) => {
  res.json({ mensaje: "Ruta de publicaciones OK" });
});

export default router;
