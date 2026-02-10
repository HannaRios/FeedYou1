import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./db.js";

import usuarioRoutes from "./backend/routes/usuarioRoutes.js";
import feedRoutes from "./backend/routes/feedRoutes.js";
import publicacionRoutes from "./backend/routes/publicacionRoutes.js";
import categoriasRoutes from "./backend/routes/categorias.js";
import interesesRoutes from "./backend/routes/interesesRoutes.js";

import chatRoutes from "./backend/routes/chatRoutes.js";
import authRoutes from "./backend/routes/authRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

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

// Rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/publicaciones", publicacionRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/intereses", interesesRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ 
    error: "Error interno del servidor",
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});



//Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor FeedYou corriendo en puerto ${PORT}`);
  console.log(`📋 GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? "✅ Configurado" : "❌ NO configurado"}`);
});