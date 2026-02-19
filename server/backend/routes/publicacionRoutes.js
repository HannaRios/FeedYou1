// server/backend/routes/publicacionRoutes.js
import express from "express";
import { crearPublicacionController } from "../controllers/publicacionController.js";
import { obtenerPublicacionesController } from "../controllers/publicacionController.js";

import { uploadPublicacion as upload, uploadPublicacion } from "../middlewares/uploadPublicacion.js";

const router = express.Router();
//crear publicaciones
router.post("/", uploadPublicacion.single("archivo"), crearPublicacionController);
//obtener publicaciones
router.get("/", obtenerPublicacionesController);


export default router;
