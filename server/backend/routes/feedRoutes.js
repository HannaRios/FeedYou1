import express from "express";
import { feedParaTi } from "../controllers/feedController.js";

const router = express.Router();

// GET /api/feed/:email
router.get("/para-ti/:email", feedParaTi);

export default router;
