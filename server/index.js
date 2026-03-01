import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./db.js";
import usuarioRoutes from "./backend/routes/usuarioRoutes.js";
import feedRoutes from "./backend/routes/feedRoutes.js";
import chatRoutes from "./backend/routes/chatRoutes.js";
import authRoutes from "./backend/routes/authRoutes.js";


dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
app.get("/", (req, res) => {
  res.send("Servidor FeedYou funcionando ✅");
});

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ 
    error: "Error interno del servidor",
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor FeedYou corriendo en puerto ${PORT}`);
  console.log(`📋 GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? "✅ Configurado" : "❌ NO configurado"}`);
});