import React from 'react';
import { Instagram, Facebook, Youtube  } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import PhoneMockup from "../components/PhoneMockup";

/* ===== LOGO ===== */
function Logo({ size = 'md' }) {
  const sizes = {
    sm: 32,
    md: 48,
    lg: 64,
  };

  return (
    <Link to="/" className="flex items-center gap-3">
      <img
        src="/logo.png"
        alt="FeedYou Logo"
        width={sizes[size]}
        height={sizes[size]}
      />
    </Link>
  );
}

/* ===== LANDING ===== */
export default function FeedYouLanding() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen font-sans bg-cover bg-center bg-no-repeat flex flex-col"
      style={{ backgroundImage: "url('/fondoFeedyou.png')" }}
    >
      {/* ===== NAVBAR ===== */}
      <header className="absolute top-0 left-0 w-full z-20">
        <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between text-white">
          <Logo size="md" />

          <div className="flex gap-4">
            <Link to="/login">
              <button className="px-6 py-2 rounded-full border border-white/40 bg-white/10 backdrop-blur-md hover:bg-white/20 transition">
                Iniciar sesión
              </button>
            </Link>

            <Link to="/register">
              <button className="px-6 py-2 rounded-full bg-white text-black hover:bg-gray-200 transition">
                Crear cuenta
              </button>
            </Link>
          </div>
        </nav>
      </header>

      {/* ===== HERO ===== */}
      <main className="flex-1 max-w-7xl mx-auto px-6 pt-28 pb-20 flex items-center">
        <div className="grid md:grid-cols-2 gap-16 items-center w-full">

          {/* TEXTO */}
          <div className="text-white">
            <h2 className="text-xl mb-2 opacity-80">Bienvenido a</h2>

            <h1
              className="text-7xl font-extrabold mb-8 bg-gradient-to-r from-[#c3b8ff] via-[#f5b6ec] to-[#ffd6a5] bg-clip-text text-transparent"
              style={{ fontFamily: 'Comic Sans MS, cursive' }}
            >
              FeedYou
            </h1>

            <p className="text-lg leading-relaxed max-w-xl mb-10 opacity-90">
              En FeedYou, el contenido se adapta a tus gustos desde el primer momento.
              Música, cine, libros, moda o videojuegos.
              <br />
              <strong>Sin distracciones. Sin contenido irrelevante.</strong>
            </p>

            <button
              onClick={() => navigate('/register')}
              className="px-10 py-3 rounded-full bg-[#d9efff] text-gray-900 font-medium hover:bg-white transition"
            >
              ¡Comienza esta experiencia!
            </button>
          </div>

          {/* MOCKUP */}
          <div className="flex justify-center mt-24 md:mt-0">
            <PhoneMockup />
          </div>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-black/40 backdrop-blur-md text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">

          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo */}
            <div>
              <Logo size="md" />
              <div className="flex gap-3 mt-4">
                <div className="flex gap-3 mt-4">
  <a href="https://www.instagram.com/feedyou_hvn?igsh=bWpiYWJ2NmJrMTZk&utm_source=ig_contact_invite" target="_blank" rel="noopener noreferrer">
    <Instagram className="w-5 h-5 hover:text-pink-400 cursor-pointer" />
  </a>

  <a href="https://www.facebook.com/profile.php?id=61577519739122" target="_blank" rel="noopener noreferrer">
    <Facebook className="w-5 h-5 hover:text-blue-400 cursor-pointer" />
  </a>

  <a href="https://www.tiktok.com/@feedyou_use?_r=1&_t=ZS-951nYV9LvwS" target="_blank" rel="noopener noreferrer">
  <SiTiktok className="w-5 h-5 hover:text-white cursor-pointer" />
</a>
</div>
              </div>
            </div>

            {/* Navegación */}
            <div>
              <h3 className="font-semibold mb-4">Contenido</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>Para ti</li>
                <li>Tendencias</li>
                <li>Favoritos</li>
                <li>Categorías</li>
              </ul>
            </div>

            {/* About */}
            <div>
              <h3 className="font-semibold mb-4">Sobre FeedYou</h3>
              <p className="text-gray-300 text-sm">
                El lugar donde el contenido está hecho a la medida.
                Creamos experiencias únicas basadas en tus gustos.
              </p>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="hover:text-white cursor-pointer">Términos y condiciones</li>
                <li className="hover:text-white cursor-pointer">Política de privacidad</li>
                <li className="hover:text-white cursor-pointer">Preferencias de cookies</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-6 flex flex-wrap justify-between items-center text-sm text-gray-300">
            <p>© 2026 FeedYou. Todos los derechos reservados.</p>
            <button className="hover:text-white">Accesibilidad</button>
          </div>

        </div>
      </footer>
    </div>
  );
}