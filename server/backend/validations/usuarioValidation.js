// backend/validations/usuarioValidation.js
import { check } from "express-validator";

// Validaciones para el registro de usuario
export const validarRegistro = [
  check("nombre")
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio")
    .isString().withMessage("El nombre debe ser texto")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/)
    .withMessage("El nombre solo puede contener letras y espacios")
    .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),

  check("email")
    .trim()
    .isEmail().withMessage("Correo inválido")
    .normalizeEmail(),

  check("contrasena")
    .isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/^(?=.*[A-Z])(?=.*\d)/)
    .withMessage("La contraseña debe contener al menos una mayúscula y un número"),
];

// Validaciones para el inicio de sesión
export const validarLogin = [
  check("email")
    .trim()
    .isEmail().withMessage("Correo inválido")
    .normalizeEmail(),

  check("contrasena")
    .notEmpty().withMessage("La contraseña es obligatoria"),
];
