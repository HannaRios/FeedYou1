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
  connectionLimit: 50,
  queueLimit: 0
});

// Verificar conexion
db.getConnection()
  .then(async connection => {
    console.log("✅ Conectado a la base de datos MySQL (FeedYou)");

    try {
      // Auto-crear tabla seguidores y notificaciones para prevenir errores en Railway
      await connection.query(`
        CREATE TABLE IF NOT EXISTS seguidores (
          id_seguimiento INT AUTO_INCREMENT PRIMARY KEY,
          email_seguidor VARCHAR(255) NOT NULL,
          email_seguido VARCHAR(255) NOT NULL,
          fecha_seguimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX (email_seguidor),
          INDEX (email_seguido)
        )
      `);
      
      await connection.query(`
        CREATE TABLE IF NOT EXISTS notificaciones (
          id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
          email_destino VARCHAR(255) NOT NULL,
          email_origen VARCHAR(255) NOT NULL,
          tipo VARCHAR(50) NOT NULL,
          leida BOOLEAN DEFAULT FALSE,
          fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("✅ Tablas 'seguidores' y 'notificaciones' verificadas/creadas automáticamente.");
    } catch (createErr) {
      console.error("❌ Error verificando/creando tablas:", createErr.message);
    }

    connection.release();
  })
  .catch(err => {
    console.error("❌ Error al conectar a la base de datos:", err.message);
  });

export default db;