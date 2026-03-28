import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import "./db.js";
import path from "path";
import { fileURLToPath } from "url";

// ================== IMPORTAR RUTAS ==================
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

// ================== CONFIG PATH ==================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================== CORS ==================
app.use(cors({
  origin: "*", // 🔥 permite Railway y frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// ================== MIDDLEWARES ==================
app.use(express.json());

// Archivos estáticos (uploads)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ================== LOGGER ==================
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ================== RUTA TEST ==================
app.get("/", (req, res) => {
  res.send("Servidor FeedYou funcionando 🚀");
});

// ================== RUTAS API ==================
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

// ================== SOCKET.IO ==================
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

export { io };

// ================== FRONTEND ==================
app.use(express.static(path.join(__dirname, "..", "dist")));

app.get("/:path*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

// ================== MANEJO DE ERRORES ==================
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Error interno del servidor"
  });
});

// ================== PUERTO ==================
const PORT = process.env.PORT || 4000;

// Agregamos '0.0.0.0' para que Railway pueda ver la app
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor FeedYou corriendo en puerto ${PORT}`);
  console.log(`GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? "Configurado" : "NO configurado"}`);
});