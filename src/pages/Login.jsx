import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Validaciones básicas
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "El correo es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo no es válido";
    }

    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Actualiza campos y limpia errores al escribir
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setMensaje("");

    try {
      const res = await fetch("http://localhost:4000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          contrasena: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

      setMensaje("Inicio de sesión exitoso ✅");

      // Guardar usuario autenticado
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      localStorage.setItem("email", data.usuario.email);

      // Redirige al feed (puedes cambiar la ruta si quieres)
      setTimeout(() => navigate("/feed"), 1000);
    } catch (err) {
      setMensaje(err.message || "Error al iniciar sesión ❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  //  Manejo del login con Google
  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("🔑 Token recibido de Google");
    setMensaje("Iniciando sesión con Google...");

    try {
      const res = await fetch("http://localhost:4000/api/auth/google", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ 
          token: credentialResponse.credential 
        }),
      });
      console.log("Enviando token:", credentialResponse.credential);

      console.log("📡 Respuesta del servidor:", res.status);

      const data = await res.json();
      console.log("📦 Datos recibidos:", data);

      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar sesión con Google");
      }

      // Guardar usuario en localStorage
      localStorage.setItem("usuario", JSON.stringify(data.user));
      
      setMensaje("✅ Inicio de sesión exitoso con Google");
      
      // Redirigir después de 500ms
      setTimeout(() => {
        navigate("/feed");
      }, 500);

    } catch (error) {
      console.error("❌ Error en Google Login:", error);
      setMensaje(`Error: ${error.message}`);
    }
  };

  const handleGoogleError = () => {
    console.error("❌ Error en Google Login");
    setMensaje("Error al iniciar sesión con Google");
  };

  return (
    <AuthLayout>
      <div className="pt-12">
        {/* Título */}
        <h1
          className="text-center text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#c3b8ff] via-[#f5b6ec] to-[#ffd6a5] mb-8"
          style={{ fontFamily: "Comic Sans MS, cursive" }}
        >
          FeedYou
        </h1>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Correo"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.email
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.password
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Botón Iniciar Sesión */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        {/* Mensaje de estado */}
        {mensaje && (
          <p
            className={`text-center mt-3 text-sm font-medium ${
              mensaje.includes("✅") || mensaje.includes("exitoso")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {mensaje}
          </p>
        )}

        {/* Divisor */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">o</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Botón Google */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            auto_select={false}
          />
        </div>

        {/* Links inferiores */}
        <div className="mt-6 space-y-3 text-center text-sm">
          <Link
            to="/forgot-password"
            className="block text-gray-600 hover:text-blue-500 transition"
          >
            ¿Olvidaste tu contraseña?
          </Link>

          <div className="text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/register"
              className="text-blue-500 hover:underline font-semibold"
            >
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}