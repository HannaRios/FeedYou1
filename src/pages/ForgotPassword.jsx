import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    console.log("Enviando petición...");

    const response = await fetch(
      "http://localhost:4000/api/auth/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      }
    );

    const data = await response.json();
    console.log("Respuesta backend:", data);

    if (!response.ok) {
      throw new Error(data.error || "Error al enviar correo");
    }

    setEmailSent(true);

  } catch (error) {
    console.error("Error real:", error);
    alert("Hubo un error al enviar el correo");
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

        <h2 className="text-xl font-semibold text-center mb-2">
          ¿Olvidaste tu contraseña?
        </h2>

        <p className="text-sm text-gray-600 text-center mb-6 px-4">
          Ingresa tu correo electrónico y te enviaremos un enlace para 
          restablecer tu contraseña.
        </p>

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              placeholder="correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            />


            <button
              type="submit"
              className="w-full bg-blue-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-blue-300 transition"
            >
              Enviar enlace de recuperación
            </button>


            <Link
              to="/login"
              className="block w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition text-center"
            >
              Volver al inicio de sesión
            </Link>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700">
                ✓ Si el correo existe, recibirás un enlace a <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Revisa tu bandeja de entrada y sigue las instrucciones.
              </p>
            </div>

            <Link
              to="/login"
              className="block w-full bg-blue-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-blue-300 transition"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}