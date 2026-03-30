import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import "./db.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= COPIA DE SEGURIDAD DE IMÁGENES ESTÁTICAS =================
// Asegurar que exista la carpeta y las imágenes críticas (default.png, newsapi.png) en el volumen persistente de Railway
const perfilesPath = path.join(__dirname, "uploads", "perfiles");
const imagesToCopy = [
  { source: path.join(__dirname, "assets", "default.png"), target: path.join(perfilesPath, "default.png") },
  { source: path.join(__dirname, "assets", "newsapi.png"), target: path.join(perfilesPath, "newsapi.png") }
];

try {
  if (!fs.existsSync(perfilesPath)) {
    fs.mkdirSync(perfilesPath, { recursive: true });
  }
  for (const img of imagesToCopy) {
    if (!fs.existsSync(img.target) && fs.existsSync(img.source)) {
      console.log(`Copiando imagen de seguridad [${path.basename(img.target)}] al volumen persistente...`);
      fs.copyFileSync(img.source, img.target);
    }
  }
} catch (error) {
  console.error("Error al asegurar imágenes estáticas:", error);
}
// ====================================================================

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
import notificacionesRoutes from "./backend/routes/notificacionesRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
// Middlewares

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Parsear JSON
app.use(express.json());

// Servir archivos estáticos (fotos de perfil, publicaciones, etc.)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Fallback para fotos de perfil perdidas (ej. redeploy en Railway o rutas faltantes)
app.use("/uploads/perfiles", (req, res) => {
  // Enviar el archivo directo desde assets para que nunca falle (aunque no esté en uploads)
  res.sendFile(path.join(__dirname, "assets", "default.png"));
});

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
app.use("/api/auth", authRoutes);
app.use("/api/newsapi", newsApiRoutes);
app.use("/api/test", testRoutes);
app.use("/api/interacciones", interaccionesRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notificaciones", notificacionesRoutes);



app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ 
    error: "Error interno del servidor",
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});



// ================= SOCKET.IO =================

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

// Exportar después de crear io
export { io };

//Puerto
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor FeedYou corriendo en puerto ${PORT}`);
  console.log(`GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? "Configurado" : "NO configurado"}`);
});