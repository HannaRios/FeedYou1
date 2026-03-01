import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { registrarUsuario } from "../services/userService";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensaje, setMensaje] = useState("");

  //  Validación HTML5 + Reglas Personalizadas
  const validateForm = () => {
    const newErrors = {};

    // Campo requerido y longitud mínima
    if (!formData.fullName.trim()) {
      newErrors.fullName = "El nombre completo es requerido";
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "Debe tener al menos 3 caracteres";
    }

    // Validación de correo con Regex más estricto
    if (!formData.email) {
      newErrors.email = "El correo es requerido";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Correo no válido (ej: ejemplo@correo.com)";
    }

    // Validación username
    if (!formData.username) {
      newErrors.username = "El nombre de usuario es requerido";
    } else if (!/^[a-zA-Z0-9_]{3,15}$/.test(formData.username)) {
      newErrors.username =
        "Solo letras, números y guiones bajos (3-15 caracteres)";
    }

    // Validación de contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 8) {
      newErrors.password = "Debe tener al menos 8 caracteres";
    }

    // Confirmar contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Debes confirmar tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Valida en tiempo real mientras el usuario escribe
  useEffect(() => {
    validateForm();
  }, [formData]);

  // 🖋 Manejador de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // Envío del formulario
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsSubmitting(true);
  setMensaje("");

  try {
    const usuario = {
      nombre: formData.fullName,
      email: formData.email,
      username: formData.username,
      contrasena: formData.password,
    };

    const res = await registrarUsuario(usuario);

    // 🔥 GUARDAMOS USUARIO EN LOCALSTORAGE
    localStorage.setItem(
      "user",
      JSON.stringify(res.usuario || { email: formData.email })
    );

    setMensaje(res.mensaje || "Registro exitoso ✅");

    // Redirige al test
    setTimeout(() => navigate("/interest-test"), 800);

  } catch (err) {
    setMensaje(err.message || "Error al registrar ❌");
  } finally {
    setIsSubmitting(false);
  }
};

  const isFormValid = Object.keys(errors).length === 0 && formData.fullName && formData.email && formData.username && formData.password && formData.confirmPassword;

  return (
    <AuthLayout>
      <div className="pt-12">
        <h1
          className="text-center text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#c3b8ff] via-[#f5b6ec] to-[#ffd6a5] mb-8"
          style={{ fontFamily: "Comic Sans MS, cursive" }}
        >
          FeedYou
        </h1>

        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          {/* Nombre completo */}
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Nombre completo"
              required
              minLength={3}
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition text-sm ${
                errors.fullName
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              required
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition text-sm ${
                errors.email
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              required
              pattern="^[a-zA-Z0-9_]{3,15}$"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition text-sm ${
                errors.username
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              }`}
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-500">{errors.username}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition text-sm ${
                errors.password
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              required
              minLength={6}
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition text-sm ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Mensaje final */}
          <p className="text-xs text-gray-500 text-center px-2 leading-relaxed">
            Al registrarte, aceptas nuestros términos, reglas y políticas.
          </p>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="flex-1 bg-blue-200 text-gray-800 py-2.5 rounded-lg font-semibold hover:bg-blue-300 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Registrando..." : "Registrarte"}
            </button>
            <Link
              to="/login"
              className="flex-1 bg-gray-200 text-gray-800 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition text-center text-sm"
            >
              Volver
            </Link>
          </div>

          {mensaje && (
            <p className="text-center mt-3 text-sm text-blue-600">{mensaje}</p>
          )}
        </form>
      </div>
    </AuthLayout>
  );
}
