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
        className="fixed bottom-4 left-4 md:bottom-6 md:left-6 bg-blue-200 p-3 md:p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-40"
      >
        <PlusCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-700" />
      </button>


      {/* Botón flotante YouBot */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-blue-200 p-3 md:p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-40"
      >
        <Bot className="w-5 h-5 md:w-6 md:h-6 text-blue-700" />
      </button>

      {isChatOpen && (
        <ChatBot onClose={() => setIsChatOpen(false)} />
      )}

      <CreatePost
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
    </div>
  );
}