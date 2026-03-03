import express from "express";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import db from "../../db.js";
import { validarRegistro, validarLogin } from "../validations/usuarioValidation.js";
import { uploadPerfil } from "../middlewares/uploadPerfil.js";
import { sendWelcomeEmail } from "../services/emailService.js";

const router = express.Router();

// Registrar usuario

router.post("/register", validarRegistro, async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    console.log("Errores de validación:", errores.array());
    return res.status(400).json({ errores: errores.array() });
  }

  const { nombre, email, contrasena } = req.body;

  try {
    // 1. Verificar si el email ya existe
    const [existing] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // 2. Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // 3. Guardar usuario
    await db.query(
      "INSERT INTO usuarios (nombre, email, contrasena, provider) VALUES (?, ?, ?, ?)",
      [nombre, email, hashedPassword, "local"]
    );

    console.log(`Usuario ${nombre} guardado en DB.`);

    // 4. --- AQUÍ ESTÁ EL TRUCO: ENVIAR EL CORREO ---
    try {
      console.log("Intentando enviar correo de bienvenida...");
      await sendWelcomeEmail(email, nombre);
      console.log("Correo enviado con éxito");
    } catch (mailError) {
      // Logueamos el error pero no detenemos el registro del usuario
      console.error("El usuario se registró pero el correo falló:", mailError);
    }

    res.json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("Error al registrar:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Login de usuario
router.post("/login", validarLogin, async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { email, contrasena } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuario = rows[0];

    // Evitar login normal en cuentas Google
    if (usuario.provider === "google") {

      return res.status(400).json({
        error: "Esta cuenta usa Google Login"
      });
    }

    const passwordValida = await bcrypt.compare(
      contrasena,
      usuario.contrasena
    );


    if (!passwordValida) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.json({
      mensaje: "Inicio de sesión exitoso",
      usuario: { email: usuario.email, nombre: usuario.nombre },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//  Buscar usuarios por email
router.get("/buscar", async (req, res) => {
  try {
    const { q, currentEmail } = req.query;

    if (!q || q.trim() === "") {
      return res.json([]);
    }

    const search = `%${q}%`;

    let sql = `
      SELECT email, foto_perfil
      FROM usuarios
      WHERE email LIKE ?
    `;

    const params = [search];

    if (currentEmail) {
      sql += ` AND email != ?`;
      params.push(currentEmail);
    }

    sql += ` LIMIT 10`;

    const [usuarios] = await db.query(sql, params);

    res.json(usuarios);

  } catch (error) {
    console.error("Error buscando usuarios:", error);
    res.status(500).json({ error: "Error en búsqueda" });
  }
});

// Obtener usuario por email
router.get("/:email", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT email, nombre, foto_perfil, bio FROM usuarios WHERE email = ?",
      [req.params.email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuario = rows[0];
    
    res.json({
      email: usuario.email,
      nombre: usuario.nombre,
      bio: usuario.bio || "",
      foto_perfil: usuario.foto_perfil || "/uploads/perfiles/default.png"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error servidor" });
  }
});



//  Subir / cambiar foto de perfil
router.post(
  "/foto-perfil",
  uploadPerfil.single("foto"),
  async (req, res) => {
    try {
      const { email } = req.body;

      if (!email || !req.file) {
        return res.status(400).json({ message: "Datos incompletos" });
      }

      const ruta = `/uploads/perfiles/${req.file.filename}`;

      await db.query(
        "UPDATE usuarios SET foto_perfil = ? WHERE email = ?",
        [ruta, email]
      );

      res.json({
        message: "Foto de perfil actualizada",
        foto_perfil: ruta,
      });
    } catch (error) {
      console.error("Error foto perfil:", error);
      res.status(500).json({ message: "Error al subir foto" });
    }
  }
);

router.put("/actualizar", async (req, res) => {

  try {

    console.log("BODY RECIBIDO:", req.body);

    const { email, nombre, bio } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email es requerido"
      });
    }

    const [result] = await db.query(
      "UPDATE usuarios SET nombre = ?, bio = ? WHERE email = ?",
      [nombre || "", bio || "", email]
    );

    console.log("RESULTADO:", result);

    res.json({
      message: "Perfil actualizado correctamente"
    });

  } catch (error) {

    console.error("ERROR ACTUALIZAR PERFIL:", error);

    res.status(500).json({
      error: error.message
    });

  }

});


export default router;