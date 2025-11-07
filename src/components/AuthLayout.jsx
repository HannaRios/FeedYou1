import React from 'react';
import Logo from './Logo';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Contenido (Card blanca centrada) */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative">
        {/* Logo en la esquina superior */}
        <div className="absolute top-4 left-4">
        <Logo size="md" showText={false} />
        </div>


        {/* Contenido de la página */}
        {children}
      </div>

      {/* Link para volver al inicio */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 transition flex items-center gap-2 font-medium"
      >
        ← Volver al inicio
      </Link>
    </div>
  );
}