import React from 'react';
import { Instagram, Facebook, Youtube } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Componente de Logo
function Logo({ size = 'md', showText = false }) {
  const sizes = {
    sm: { dimension: 32, text: 'text-lg' },
    md: { dimension: 48, text: 'text-2xl' },
    lg: { dimension: 64, text: 'text-3xl' }
  };

  return (
    <Link to="/" className="flex items-center gap-3 cursor-pointer group">
      <img 
        src="/logo.png" 
        alt="FeedYou Logo" 
        width={sizes[size].dimension}
        height={sizes[size].dimension}
        className="transition-transform group-hover:scale-110 group-hover:drop-shadow-lg"
      />
      {showText && (
        <span className={`${sizes[size].text} font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent`}
          style={{ fontFamily: 'Comic Sans MS, cursive' }}>
         
        </span>
      )}
    </Link>
  );
}

export default function FeedYouLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans bg-gray-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" showText={true} />
          <div className="flex gap-3">
            <Link to="/login">
              <button className="px-6 py-2 border-2 border-blue-300 text-gray-700 rounded-lg hover:bg-blue-50 transition">
                Iniciar Sesión
              </button>
            </Link>
            <Link to="/register">
              <button className="px-6 py-2 bg-blue-200 text-gray-700 rounded-lg hover:bg-blue-300 transition">
                Crear Cuenta
              </button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-12 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-2xl mb-6 font-light">Bienvenido a</h2>
            <h1 
            className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#c3b8ff] via-[#f5b6ec] to-[#ffd6a5] mb-8"
            style={{ fontFamily: 'Comic Sans MS, cursive' }}>
            FeedYou
          </h1>
        



              <p className="text-lg leading-relaxed mb-8 max-w-md">
                En FeedYou, el contenido se adapta a tus gustos desde el primer momento. 
                Música, cine, libros, moda o videojuegos: aquí ves solo lo que realmente te 
                interesa. Sin distracciones, sin contenido irrelevante.
              </p>
              <button 
                onClick={() => navigate('/register')}
                className="bg-blue-200 text-gray-800 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-300 transition cursor-pointer"
              >
                Comienza esta experiencia!
              </button>
            </div>
          </div>

          {/* Right Side - Phone Mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-[3rem] transform rotate-3"></div>
            
            <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[3rem] p-8">
              {/* Floating Icons */}
              <div className="absolute top-8 left-12 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-lg"></div>
              </div>
              
              <div className="absolute top-20 right-16 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-pink-300 rounded-full"></div>
              </div>

              <div className="absolute top-12 right-32 flex gap-2">
                <div className="w-8 h-8 bg-cyan-300 rounded-full"></div>
                <div className="w-8 h-8 bg-yellow-300 rounded-full"></div>
              </div>

              <div className="absolute top-32 left-8 w-14 h-14 bg-pink-200 rounded-2xl shadow-lg"></div>
              <div className="absolute top-44 left-16 w-12 h-12 bg-orange-300 rounded-2xl shadow-lg"></div>

              <div className="absolute top-20 right-4 w-14 h-14 bg-purple-400 rounded-2xl shadow-lg"></div>
              <div className="absolute top-56 right-8 w-12 h-12 bg-orange-300 rounded-xl shadow-lg"></div>

              {/* Phone */}
              <div className="relative mx-auto w-64 bg-black rounded-[2.5rem] p-2 shadow-2xl">
                <div className="bg-white rounded-[2rem] overflow-hidden">
                  {/* Notch */}
                  <div className="bg-black h-6 w-32 mx-auto rounded-b-2xl"></div>
                  
                  {/* Screen Content */}
                  <div className="p-4 pb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-pink-300 rounded-full"></div>
                      <span className="text-sm font-medium">@user1</span>
                    </div>
                    
                    <div className="bg-gray-100 rounded-xl p-3 mb-3">
                      <p className="text-xs mb-2">Estrenos de este mes</p>
                      <div className="bg-gray-300 rounded-lg h-24 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
                      </div>
                    </div>

                    <div className="flex gap-4 justify-center text-gray-600 mb-4">
                      <button className="text-red-500 text-2xl">♥</button>
                      <button className="text-gray-400 text-2xl">★</button>
                      <button className="text-gray-400 text-2xl">⋯</button>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-gradient-to-r from-pink-300 to-pink-400 h-10 rounded-full flex items-center justify-between px-4 mb-4">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>

                    {/* Bottom Icons */}
                    <div className="flex justify-around">
                      <button className="w-10 h-10 bg-green-300 rounded-xl"></button>
                      <button className="w-10 h-10 bg-cyan-300 rounded-full flex items-center justify-center text-white text-xl">+</button>
                      <button className="w-10 h-10 bg-cyan-300 rounded-full"></button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Hearts */}
              <div className="absolute bottom-32 right-8">
                <div className="text-red-400 text-4xl">♥</div>
              </div>
              <div className="absolute bottom-24 right-16">
                <div className="text-red-400 text-3xl">♥</div>
              </div>
              <div className="absolute bottom-16 right-12">
                <div className="text-red-500 text-5xl">♥</div>
              </div>

              {/* Blue Bar */}
              <div className="absolute top-48 right-24 w-32 h-8 bg-cyan-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo Column */}
            <div>
              <Logo size="md" showText={false} />
              <div className="flex gap-3">
                <Instagram className="w-5 h-5 cursor-pointer hover:text-pink-400 transition" />
                <Facebook className="w-5 h-5 cursor-pointer hover:text-blue-400 transition" />
                <Youtube className="w-5 h-5 cursor-pointer hover:text-red-400 transition" />
                <div className="w-5 h-5 cursor-pointer hover:text-red-400 transition">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0a12 12 0 1012 12A12 12 0 0012 0zm0 19a1.5 1.5 0 111.5-1.5A1.5 1.5 0 0112 19zm1.5-6.38V15h-3v-2.62A4.25 4.25 0 0112 4a4.25 4.25 0 011.5 8.24z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div>
              <h3 className="font-semibold mb-4">contenido de FeedYou</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer">Para ti</li>
                <li className="hover:text-white cursor-pointer">Tendencias</li>
                <li className="hover:text-white cursor-pointer">Favoritos</li>
                <li className="hover:text-white cursor-pointer">Categorías</li>
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
                <li className="hover:text-white cursor-pointer">Términos y condiciones.</li>
                <li className="hover:text-white cursor-pointer">Política de privacidad.</li>
                <li className="hover:text-white cursor-pointer">Preferencias de cookies.</li>
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