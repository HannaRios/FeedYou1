import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./db.js";
import usuarioRoutes from "./backend/routes/usuarioRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Ruta base para comprobar si el servidor responde
app.get("/", (req, res) => {
  res.send("Servidor FeedYou funcionando ✅");
});

// Aquí montamos las rutas de usuarios
app.use("/api/usuarios", usuarioRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`✅ Servidor FeedYou corriendo en puerto ${PORT}`)
);
