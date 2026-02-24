import React from "react";
import Logo from "./Logo";
import { Link } from "react-router-dom";

export default function AuthLayout({ children }) {
  return (
    <div
      className="
        min-h-screen
        flex items-center justify-center
        relative
        overflow-hidden
        bg-[#0b0f1a]
      "
    >
      {/*FONDO OSCURO */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{
          backgroundImage: "url('/fondoFeedyou.png')",
        }}
      />


      {/*LINK VOLVER AL INICIO */}
      <Link
        to="/"
        className="
          absolute top-6 left-6 z-20
          text-white/80 hover:text-white
          transition flex items-center gap-2 font-medium
        "
      >
        ← Volver al inicio
      </Link>

      {/*CARD PRINCIPAL*/}
      <div
        className="
          relative z-10
          w-full max-w-md
          bg-white
          backdrop-blur-xl
          rounded-3xl
          shadow-2xl
          p-8
        "
      >
        {/* Logo */}
        <div className="absolute top-5 left-5">
          <Logo size="md" showText={false} />
        </div>

        {/* Contenido */}
        {children}
      </div>
    </div>
  );
}
