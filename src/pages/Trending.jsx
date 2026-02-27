import { useState } from "react";
import Navbar from "../components/Navbar";
import ChatBot from "../components/ChatBot";
import CreatePost from "../components/CreatePost";
import { Bot, PlusCircle } from "lucide-react";

export default function Trending() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Tendencias
        </h2>
        <p className="text-gray-600">
          Aquí se mostrarán las publicaciones más populares del momento.
        </p>
      </div>

      {/* Botón crear publicación */}
      <button
        onClick={() => setIsCreatePostOpen(true)}
        className="fixed bottom-6 left-6 bg-blue-200 p-4 rounded-full shadow-lg"
      >
        <PlusCircle className="w-6 h-6 text-blue-700" />
      </button>

      {/* Botón YouBot */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-blue-200 p-4 rounded-full shadow-lg"
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
    </div>
  );
}