import { validationResult } from "express-validator";
import { insertarUsuario, obtenerUsuarios } from "../models/usuarioModel.js";
import bcrypt from "bcryptjs";

export const crearUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  const { email, nombre, contrasena } = req.body;
  const hash = await bcrypt.hash(contrasena, 10);

  try {
    await insertarUsuario(email, nombre, hash);
    res.json({ mensaje: "Usuario registrado correctamente" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "El correo ya está registrado" });
    } else {
      console.error(err);
      res.status(500).json({ error: "Error al registrar el usuario" });
    }
  }
};

export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await obtenerUsuarios();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};
