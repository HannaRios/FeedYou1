import { useState } from 'react';
import { X, Send, Menu } from 'lucide-react';

export default function ChatBot({ isOpen, onClose }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: '¡Hola! Soy YouBot, tu asistente personal de contenido. ¿En qué puedo ayudarte hoy?',
      time: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: message,
      time: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    setMessage('');

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: getBotResponse(message),
        time: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    if (msg.includes('hola') || msg.includes('hey')) {
      return '¡Hola! ¿Cómo puedo ayudarte con tu feed personalizado?';
    } else if (msg.includes('ayuda')) {
      return 'Puedo ayudarte a encontrar contenido, ajustar tus preferencias o responder preguntas sobre FeedYou.';
    } else if (msg.includes('música') || msg.includes('musica')) {
      return '¿Quieres ver más contenido de música? Puedo mostrarte las últimas tendencias musicales.';
    } else if (msg.includes('película') || msg.includes('pelicula') || msg.includes('cine')) {
      return '¡Genial! Puedo recomendarte películas basadas en tus gustos. ¿Qué género prefieres?';
    } else {
      return 'Interesante. Déjame buscar contenido relacionado con eso.';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Ventana del chat */}
      <div className="fixed bottom-10 right-6 w-80 h-[400px] bg-pink-50 rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="bg-pink-200 p-3 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
              <img src="/logo.png" alt="YouBot" className="w-7 h-7 rounded-full" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-800">YouBot</h3>
              <p className="text-xs text-gray-600">Tu asistente personal</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/30 p-1 rounded-full transition">
            <X className="w-4 h-4 text-gray-800" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-pink-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-xl px-3 py-2 text-sm ${
                msg.type === 'user'
                  ? 'bg-pink-300 text-white rounded-br-none'
                  : 'bg-white shadow text-gray-800 rounded-bl-none'
              }`}>
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.type === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t border-pink-200 p-3 bg-pink-50 flex items-center gap-2 rounded-b-2xl">
          <button className="p-2 hover:bg-pink-100 rounded-full transition">
            <Menu className="w-4 h-4 text-gray-600" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-3 py-1.5 border border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="bg-pink-300 p-2 rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Animación */}
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </>
  );
}
