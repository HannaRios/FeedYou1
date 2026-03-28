import { useState, useRef, useEffect } from 'react';
import { 
  X, Send, Menu, MessageSquare, Trash2, 
  UserCircle, ChevronLeft, Tv, Cpu, Trophy, 
  Heart, Microscope, Briefcase 
} from 'lucide-react';

export default function ChatBot({ isOpen = true, onClose }) {
  const [message, setMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [view, setView] = useState('chat');
  const [isTyping, setIsTyping] = useState(false);

  const categories = [
    { id: 'entretenimiento', name: 'Entretenimiento', icon: <Tv className="w-4 h-4" />, color: '#FADADD', welcome: '¡Hola! Hablemos de Cine, Series, Música o Videojuegos.' },
    { id: 'tecnologia', name: 'Tecnología', icon: <Cpu className="w-4 h-4" />, color: '#D0F0FD', welcome: 'Sistemas listos. ¿Qué hay de nuevo en el mundo tech e IA?' },
    { id: 'salud', name: 'Salud', icon: <Heart className="w-4 h-4" />, color: '#E6E6FA', welcome: 'Tu bienestar es prioridad. ¿Cómo te sientes hoy?' },
    { id: 'negocios', name: 'Negocios', icon: <Briefcase className="w-4 h-4" />, color: '#FFE5B4', welcome: 'Estrategia y emprendimiento. ¿En qué trabajamos hoy?' },
    { id: 'deportes', name: 'Deportes', icon: <Trophy className="w-4 h-4" />, color: '#FADADD', welcome: '¡A por la victoria! Hablemos de resultados.' },
    { id: 'ciencia', name: 'Ciencia', icon: <Microscope className="w-4 h-4" />, color: '#D0F0FD', welcome: 'Exploremos descubrimientos científicos.' }
  ];

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('youbot_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeCat, setActiveCat] = useState(() => {
    const savedId = localStorage.getItem('youbot_category_id');
    return categories.find(c => c.id === savedId) || categories[0];
  });

  useEffect(() => {
    localStorage.setItem('youbot_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('youbot_category_id', activeCat.id);
  }, [activeCat]);

  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!message.trim() || isTyping) return;

    const userText = message;
    const userMsg = { 
      id: Date.now(), 
      type: 'user', 
      text: userText, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };

    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setIsTyping(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userText,
          category: activeCat.name 
        })
      });

      const data = await response.json();
      if (data.reply) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'bot',
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        text: "Error de conexión. 🔌",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('youbot_history');
    setIsMenuOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-10 right-6 w-80 h-[450px] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-black/5 bg-white">
      
      {/* Header */}
      <div style={{ backgroundColor: activeCat.color }} className="p-3 flex items-center justify-between shadow-sm z-20">
        <div className="flex items-center gap-2">
          {view !== 'chat' && (
            <button onClick={() => setView('chat')} className="p-1 hover:bg-black/5 rounded-full">
              <ChevronLeft className="w-5 h-5 text-gray-800"/>
            </button>
          )}
          <div className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
            {activeCat.icon}
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-800 leading-tight">
              {view === 'personalities' ? 'Categorías' : activeCat.name}
            </h3>
            <p className="text-[10px] text-gray-600 font-medium">YouBot</p>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-black/10 p-1 rounded-full text-gray-800">
          <X className="w-4 h-4" />
        </button>
      </div>

{/* Cuerpo de Chat / Categorías */}
<div 
  className="flex-1 overflow-y-auto p-3 relative" 
  ref={scrollRef}
style={{
  backgroundColor: '#f9fafb',
  backgroundImage: `linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)),
  url("/youbot.png")`,
  backgroundSize: '330px',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}}
>
  {view === 'chat' ? (
    <div className="relative z-10 space-y-3"> {/* z-10 para asegurar que el texto esté sobre el fondo */}
      {messages.length === 0 && (
        <div className="text-center py-8 opacity-70 text-xs italic px-4 bg-white/80 backdrop-blur-sm border border-black/5 rounded-xl">
          {activeCat.welcome}
        </div>
      )}
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div 
            style={{ 
              backgroundColor: msg.type === 'user' ? activeCat.color : 'rgba(255, 255, 255, 0.9)' 
            }}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm text-gray-800 backdrop-blur-sm ${
              msg.type === 'user' ? 'rounded-br-none' : 'rounded-bl-none border border-gray-100'
            }`}
          >
            <p className="whitespace-pre-wrap">{msg.text}</p>
            <p className="text-[9px] mt-1 opacity-40 text-right">{msg.time}</p>
          </div>
        </div>
      ))}
      {isTyping && (
        <div className="flex justify-start animate-pulse">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-3 py-1.5 text-[10px] text-gray-500">
            YouBot está pensando...
          </div>
        </div>
      )}
    </div>
        ) : (
          <div className="space-y-2">
            {categories.map(cat => (
              <button 
                key={cat.id} 
                onClick={() => { setActiveCat(cat); setView('chat'); }}
                className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-300 transition-all shadow-sm"
              >
                <div style={{ backgroundColor: cat.color }} className="w-8 h-8 rounded-lg flex items-center justify-center">
                  {cat.icon}
                </div>
                <span className="text-sm font-bold text-gray-800">{cat.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Menú Desplegable */}
      {isMenuOpen && (
        <div className="absolute bottom-16 left-4 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-[100] overflow-hidden">
          <button onClick={() => {setView('personalities'); setIsMenuOpen(false);}} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
            <UserCircle className="w-4 h-4" /> Cambiar Categoría
          </button>
          <button onClick={clearHistory} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 flex items-center gap-3 border-t border-gray-100">
            <Trash2 className="w-4 h-4" /> Borrar
          </button>
        </div>
      )}

      {/* Input de Mensaje */}
      <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 z-20">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className={`p-2 rounded-full transition-colors ${isMenuOpen ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          <Menu className="w-4 h-4 text-gray-600" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escribe algo..."
          className="flex-1 bg-gray-100 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
        <button 
          onClick={handleSend} 
          disabled={!message.trim() || isTyping} 
          style={{ backgroundColor: activeCat.color }}
          className="p-2 rounded-full text-gray-800 shadow-sm disabled:opacity-30 transition-transform active:scale-90"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}