import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./db.js";

import usuarioRoutes from "./backend/routes/usuarioRoutes.js";
import feedRoutes from "./backend/routes/feedRoutes.js";
import publicacionRoutes from "./backend/routes/publicacionRoutes.js";
import categoriasRoutes from "./backend/routes/categorias.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Ruta base para comprobar si el servidor responde
app.get("/", (req, res) => {
  res.send("Servidor FeedYou funcionando ✅");
});

// Rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/publicaciones", publicacionRoutes);
app.use("/api/categorias", categoriasRoutes);

//Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`✅ Servidor FeedYou corriendo en puerto ${PORT}`)
);
