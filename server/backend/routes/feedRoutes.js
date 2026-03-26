import express from "express";
import { feedParaTi, feedSeguidos } from "../controllers/feedController.js";

const router = express.Router();

// GET /api/feed/:email
router.get("/para-ti/:email", feedParaTi);

router.get("/seguidos/:email", feedSeguidos);

export default router;
