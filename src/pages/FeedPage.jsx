import { useState } from "react"; // ⚠ Import faltante
import { NavLink } from "react-router-dom";
import { Instagram, Facebook, Youtube, PlusCircle, Bot } from "lucide-react";

import Navbar from "../components/Navbar";
import Feed from "../components/Feed";
import Logo from "../components/Logo";
import ChatBot from "../components/ChatBot";

export default function FeedPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const testAnswers = {
    creatividad: "alta",
    musica: "si",
    relajacion: "no",
    tecnologia: "si",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Feed */}
      <main className="flex-grow pt-6 px-4">
        <Feed testAnswers={testAnswers} />
      </main>



      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-blue-200 p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-40"
      >
        <Bot className="w-6 h-6 text-blue-700" />
      </button>

      {/* ChatBot */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo Column */}
            <div>
              <Logo size="md" showText={false} />
              <div className="flex gap-3 mt-4">
                <Instagram className="w-5 h-5 cursor-pointer hover:text-pink-400 transition" />
                <Facebook className="w-5 h-5 cursor-pointer hover:text-blue-400 transition" />
                <Youtube className="w-5 h-5 cursor-pointer hover:text-red-400 transition" />
                <div className="w-5 h-5 cursor-pointer hover:text-red-400 transition">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0a12 12 0 1012 12A12 12 0 0012 0zm0 19a1.5 1.5 0 111.5-1.5A1.5 1.5 0 0112 19zm1.5-6.38V15h-3v-2.62A4.25 4.25 0 0112 4a4.25 4.25 0 011.5 8.24z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div>
              <h3 className="font-semibold mb-4">Contenido de FeedYou</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <NavLink to="/FeedPage" className="hover:text-white cursor-pointer">
                    Para ti
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/Trending" className="hover:text-white cursor-pointer">
                    Tendencias
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/Favorites" className="hover:text-white cursor-pointer">
                    Favoritos
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/Categories" className="hover:text-white cursor-pointer">
                    Categorías
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* About Column */}
            <div>
              <h3 className="font-semibold mb-4">Sobre FeedYou</h3>
              <p className="text-gray-400 text-sm mb-6">
                El lugar donde el contenido está hecho a la medida.
              </p>
              <p className="text-gray-400 text-sm">
                Creamos experiencias únicas basadas en tus gustos, intereses y estilo de vida.
              </p>
            </div>

            {/* Legal Column */}
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer">Términos y condiciones</li>
                <li className="hover:text-white cursor-pointer">Política de privacidad</li>
                <li className="hover:text-white cursor-pointer">Preferencias de cookies</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-wrap justify-between items-center text-sm text-gray-400">
            <div className="flex gap-4 mb-4 md:mb-0">
              <button className="hover:text-white">Español</button>
              <span>|</span>
              <button className="hover:text-white">English</button>
            </div>
            <div className="mb-4 md:mb-0">
              <p>Derechos de autor © 2025 FeedYou</p>
            </div>
            <div>
              <button className="hover:text-white">Accesibilidad</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
