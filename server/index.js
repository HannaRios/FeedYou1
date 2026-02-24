import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import "./db.js";
import path from "path";

import newsApiRoutes from "./backend/routes/newsApiRoutes.js";
import usuarioRoutes from "./backend/routes/usuarioRoutes.js";
import feedRoutes from "./backend/routes/feedRoutes.js";
import publicacionRoutes from "./backend/routes/publicacionRoutes.js";
import categoriasRoutes from "./backend/routes/categorias.js";
import interesesRoutes from "./backend/routes/interesesRoutes.js";
import testRoutes from "./backend/routes/testRoutes.js";
import interaccionesRoutes from "./backend/routes/interaccionesRoutes.js";

import chatRoutes from "./backend/routes/chatRoutes.js";
import authRoutes from "./backend/routes/authRoutes.js";


dotenv.config();

const app = express();
const server = http.createServer(app);
// Middlewares

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// Parsear JSON
app.use(express.json());

// Servir archivos estáticos (fotos de perfil, publicaciones, etc.)
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});


app.get("/", (req, res) => {
  res.send("Servidor FeedYou funcionando ");
});

// Rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/publicaciones", publicacionRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/intereses", interesesRoutes);
app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/newsapi", newsApiRoutes);
app.use("/api/test", testRoutes);
app.use("/api/interacciones", interaccionesRoutes);


app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ 
    error: "Error interno del servidor",
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ================= SOCKET.IO =================

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("🟢 Usuario conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Usuario desconectado:", socket.id);
  });
});

// Exportar después de crear io
export { io };

//Puerto
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`✅ Servidor FeedYou corriendo en puerto ${PORT}`);
  console.log(`📋 GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? "✅ Configurado" : "❌ NO configurado"}`);
});