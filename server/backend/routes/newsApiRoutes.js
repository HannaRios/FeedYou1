// rutas de newsapi

import express from "express";
import { obtenerNoticiasPorCategoria, cargarTodasLasCategorias, cargarNoticiasPorKeywords, cargarCinePorGeneros } from "../controllers/newsApiController.js";


const router = express.Router();

// GET /api/newsapi/cargar-todas
router.get("/cargar-todas", cargarTodasLasCategorias);

// GET /api/newsapi/cargar-keywords
router.get("/cargar-keywords", cargarNoticiasPorKeywords);

// GET /api/newsapi/cargar-cine-generos
router.get("/cargar-cine-generos", cargarCinePorGeneros);

// GET /api/newsapi/entertainment
router.get("/:categoria", obtenerNoticiasPorCategoria);

export default router;
