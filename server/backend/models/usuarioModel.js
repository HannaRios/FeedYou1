import { db } from "../../db.js";

export const insertarUsuario = (email, nombre, contrasena) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO usuarios (email, nombre, contrasena) VALUES (?, ?, ?)";
    db.query(sql, [email, nombre, contrasena], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const obtenerUsuarios = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT email, nombre, fecha_registro FROM usuarios";
    db.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
