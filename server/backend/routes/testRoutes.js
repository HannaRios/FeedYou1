import express from "express";
import { guardarPreferenciasTest, obtenerPreguntasTest, obtenerSubcategoriasPorCategorias } from "../controllers/testController.js";

const router = express.Router();

// POST /api/test/guardar-preferencias
router.post("/guardar-preferencias", guardarPreferenciasTest);

// POST /api/test/subcategorias
router.post("/subcategorias", obtenerSubcategoriasPorCategorias);

// GET /api/test/preguntas
router.get("/preguntas", obtenerPreguntasTest);

export default router;
