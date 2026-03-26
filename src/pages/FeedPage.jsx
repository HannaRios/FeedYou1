import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Instagram, Facebook, Youtube, PlusCircle, Bot } from "lucide-react";

import CreatePost from "../components/CreatePost";
import Navbar from "../components/Navbar";
import Feed from "../components/Feed";
import Logo from "../components/Logo";
import ChatBot from "../components/ChatBot";

export default function FeedPage() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  // Controla si el chatbot está abierto
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Respuestas simuladas del test (luego vienen del backend)
  const testAnswers = {
    creatividad: "alta",
    musica: "si",
    relajacion: "no",
    tecnologia: "si",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Barra de navegación */}
      <Navbar />

      {/* Feed principal */}
      <main className="flex-grow">
        <Feed testAnswers={testAnswers} />
      </main>

      {/* Botón flotante para crear publicación */}
      <button
        onClick={() => setIsCreatePostOpen(true)}
        className="fixed bottom-6 left-6 bg-blue-200 p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-40"
      >
        <PlusCircle className="w-6 h-6 text-blue-700" />
      </button>


      {/* Botón flotante YouBot */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-blue-200 p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-40"
      >
        <Bot className="w-6 h-6 text-blue-700" />
      </button>

      {isChatOpen && (
        <ChatBot onClose={() => setIsChatOpen(false)} />
      )}

      <CreatePost
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">

            {/* Logo */}
            <div>
              <Logo size="md" showText={false} />
              <div className="flex gap-3 mt-4">
                <Instagram className="w-5 h-5 hover:text-pink-400 cursor-pointer" />
                <Facebook className="w-5 h-5 hover:text-blue-400 cursor-pointer" />
                <Youtube className="w-5 h-5 hover:text-red-400 cursor-pointer" />
              </div>
            </div>

            {/* Navegación */}
            <div>
              <h3 className="font-semibold mb-4">Contenido</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><NavLink to="/feed">Para ti</NavLink></li>
                <li><NavLink to="/trending">Tendencias</NavLink></li>
                <li><NavLink to="/favorites">Favoritos</NavLink></li>
                <li><NavLink to="/categories">Categorías</NavLink></li>
              </ul>
            </div>

            {/* Info */}
            <div>
              <h3 className="font-semibold mb-4">Sobre FeedYou</h3>
              <p className="text-gray-400 text-sm">
                Contenido hecho a tu medida.
              </p>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Términos</li>
                <li>Privacidad</li>
                <li>Cookies</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
            © 2025 FeedYou
          </div>
        </div>
      </footer>
    </div>
  );
}