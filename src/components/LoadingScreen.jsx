import { useEffect } from "react";

export default function LoadingScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-center"
      style={{ backgroundImage: "url('/fondoFeedyou.png')" }}
    >
      {/* Logo */}
      <img src="/logo.png" alt="FeedYou Logo" className="w-24 mb-6" />

      {/* Texto */}
      <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
        Preparando tu espacio ideal...
      </h2>

      <p className="text-white/90 mb-8 drop-shadow-sm">
        Analizando tus respuestas, tus intereses
        <br /> para ofrecerte solo contenido que te encantará
      </p>

      {/* Tres puntos animados */}
      <div className="flex space-x-3 mt-4">
        <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce delay-150"></div>
        <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );
}
