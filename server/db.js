import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "1035",
  database: process.env.DB_NAME || "Feedyou",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificar conexion
db.getConnection()
  .then(connection => {
    console.log("✅ Conectado a la base de datos MySQL (FeedYou)");
    connection.release();
  })
  .catch(err => {
    console.error("❌ Error al conectar a la base de datos:", err.message);
  });

export default db;