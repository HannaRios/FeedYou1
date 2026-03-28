import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Las contraseñas no coinciden");
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ password })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setMessage("Contraseña actualizada correctamente");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout>
      <div className="pt-12">
        <h1 
            className="text-center text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#c3b8ff] via-[#f5b6ec] to-[#ffd6a5] mb-8"
            style={{ fontFamily: 'Comic Sans MS, cursive' }}>
            FeedYou
          </h1>
        <h2 className="text-xl font-semibold text-center mb-6">
          Crear nueva contraseña
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-blue-200 py-3 rounded-lg font-semibold hover:bg-blue-300"
          >
            Guardar nueva contraseña
          </button>
        </form>

        {message && (
          <p className="text-green-600 text-center mt-4">{message}</p>
        )}

        {error && (
          <p className="text-red-600 text-center mt-4">{error}</p>
        )}
      </div>
    </AuthLayout>
  );
}
