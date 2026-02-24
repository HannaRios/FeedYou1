import express from "express";
import { getFeed } from "../controllers/feedController.js";

const router = express.Router();

// Ruta para el feed
router.get("/", getFeed);


export default router;
