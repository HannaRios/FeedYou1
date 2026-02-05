import express from "express";
import { guardarIntereses } from "../controllers/interesesController.js";

const router = express.Router();

router.post("/", guardarIntereses);

export default router;
