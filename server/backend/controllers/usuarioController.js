import { validationResult } from "express-validator";
import { insertarUsuario, obtenerUsuarios } from "../models/usuarioModel.js";
import bcrypt from "bcryptjs";

export const crearUsuario = async (req, res) => {
  console.log("--- INTENTO DE REGISTRO RECIBIDO ---");
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Error de validación detectado:", errors.array());
    return res.status(400).json({ errores: errors.array() });
  }

  const { 
    email, 
    nombre, 
    username, 
    telefono, 
    genero, 
    departamento, 
    ciudad, 
    fecha_nacimiento, 
    contrasena 
  } = req.body;
  
  try {
    const hash = await bcrypt.hash(contrasena, 10);

    console.log("1. Intentando guardar en DB...");
    ç
    await insertarUsuario({
      email, 
      nombre, 
      username, 
      telefono, 
      genero, 
      departamento, 
      ciudad, 
      fecha_nacimiento, 
      hash
    });

    console.log("2. Guardado en DB con éxito.");

    console.log("3. Iniciando envío de correo...");
    await sendWelcomeEmail(email, nombre); 
    console.log("4. Correo enviado exitosamente.");

    res.json({ mensaje: "Usuario registrado correctamente" });

  } catch (err) {
    console.error("FALLO EN EL CONTROLADOR:", err); 

    // 3. Manejo de duplicados mejorado
    if (err.code === "ER_DUP_ENTRY") {
      if (err.sqlMessage.includes(email)) {
        return res.status(400).json({ error: "El correo ya está registrado" });
      }
      if (err.sqlMessage.includes(username)) {
        return res.status(400).json({ error: "El nombre de usuario ya está en uso" });
      }
      res.status(400).json({ error: "Datos duplicados detectados" });
    } else {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
};