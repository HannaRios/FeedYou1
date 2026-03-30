import { check } from "express-validator";

export const validarRegistro = [
  check("nombre")
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ min: 3 }).withMessage("Mínimo 3 caracteres"),
  
  check("username")
    .trim()
    .notEmpty().withMessage("El nombre de usuario es obligatorio")
    .matches(/^[a-zA-Z0-9_\.]+$/).withMessage("El username solo admite letras, números, puntos y guiones bajos"),

  check("email")
    .trim()
    .isEmail().withMessage("Correo inválido"),

  check("telefono")
    .optional({ checkFalsy: true })
    .isLength({ min: 7, max: 15 }).withMessage("Número de teléfono no válido"),

  check("genero")
    .notEmpty().withMessage("El género es obligatorio"),

  check("departamento")
    .notEmpty().withMessage("El departamento es obligatorio"),

  check("ciudad")
    .notEmpty().withMessage("La ciudad es obligatoria"),

  check("fecha_nacimiento")
    .notEmpty().withMessage("La fecha de nacimiento es obligatoria")
    .isDate().withMessage("Formato de fecha inválido"),

  check("contrasena")
    .isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/^(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Debe tener una mayúscula y un número"),
];

export const validarLogin = [
  check("email")
    .trim()
    .isEmail().withMessage("Debes ingresar un correo válido"),
  
  check("contrasena")
    .notEmpty().withMessage("La contraseña es obligatoria")
];