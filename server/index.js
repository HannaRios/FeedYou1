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
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

//Comprobar si servidor responde
app.get("/", (req, res) => {
  res.send("Servidor FeedYou funcionando ✅");
});

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);



const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`✅ Servidor FeedYou corriendo en puerto ${PORT}`)
);
