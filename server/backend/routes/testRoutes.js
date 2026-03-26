import express from "express";
import { guardarPreferenciasTest, obtenerPreguntasTest, obtenerSubcategoriasPorCategorias, obtenerPreferenciasUsuario } from "../controllers/testController.js";


const router = express.Router();

// POST /api/test/guardar-preferencias
router.post("/guardar-preferencias", guardarPreferenciasTest);

// POST /api/test/subcategorias
router.post("/subcategorias", obtenerSubcategoriasPorCategorias);

// GET /api/test/preguntas
router.get("/preguntas", obtenerPreguntasTest);

// GET api/test/preferencias/:email
router.get("/preferencias/:email", obtenerPreferenciasUsuario);
export default router;
