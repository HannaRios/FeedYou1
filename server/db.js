import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Creamos un pool para manejar múltiples consultas correctamente
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345H",
  database: "feedyou",
});

console.log("✅ Conectado a la base de datos MySQL (FeedYou)");

export default db;
