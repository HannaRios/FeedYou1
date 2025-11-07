import { useState } from "react";
import { Settings, Bot, PlusCircle, Instagram, Facebook, Youtube, LogOut, User, Sliders } from "lucide-react";
import { NavLink } from "react-router-dom";
import Logo from "../components/Logo";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import ChatBot from "../components/ChatBot";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("preferencias");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();

  const userName = "Hanna Rios"; 
  const userPhoto = "/profile.jpg"; 

  const handleLogout = () => {
    
    navigate("/Landing");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">
      {/* Navbar */}
      <Navbar />

      {/* Fondo con contenido */}
      <div className="flex-grow bg-[url('/bg-dark.jpg')] bg-cover bg-center flex flex-col items-center pt-10 px-4">
        {/* Contenedor principal */}
        <div className="bg-white rounded-3xl shadow-lg w-full max-w-4xl p-8 relative z-10">
          {/* Encabezado */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-800">¡{userName.split(" ")[0]}!</h1>
              <p className="text-gray-600">{userName}</p>
            </div>

            <div className="relative">
              <img
                src={userPhoto}
                alt="Perfil"
                className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
              />

              {/* Botón de configuración */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="absolute -bottom-2 -right-2 bg-gray-100 hover:bg-gray-200 p-2 rounded-full shadow"
              >
                <Settings className="w-5 h-5 text-gray-700" />
              </button>

              {/* Menú desplegable */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                  <NavLink
                    to="/edit-profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-4 h-4" /> Editar perfil
                  </NavLink>
                  <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Sliders className="w-4 h-4" /> Configuración
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4" /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Pestañas */}
          <div className="flex justify-center gap-6 mt-6 border-b border-gray-200 pb-2">
            {[
              { id: "preferencias", label: "Tus preferencias" },
              { id: "historial", label: "Historial" },
              { id: "notificaciones", label: "Notificaciones" },
              { id: "guardados", label: "Guardados" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-1 text-sm font-medium ${
                  activeTab === tab.id
                    ? "text-yellow-600 border-b-2 border-yellow-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contenido dinámico */}
          <div className="mt-6">
            {activeTab === "preferencias" && (
              <div>
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Prefieres...</h2>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { title: "Autos", img: "/autos.jpg" },
                    { title: "Moda", img: "/moda.jpg" },
                    { title: "Voleibol", img: "/voleibol.jpg" },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl overflow-hidden shadow-md hover:scale-105 transition-transform"
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-36 object-cover"
                      />
                      <p className="text-center py-2 font-medium text-gray-700">
                        {item.title}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="text-gray-500 text-sm mt-4">
                  {userName.split(" ")[0]}, has interactuado con estos temas esta semana.
                </p>
              </div>
            )}

            {activeTab === "historial" && (
              <p className="text-gray-600 text-center mt-10">
                Aquí se mostrará tu historial de interacción.
              </p>
            )}
            {activeTab === "notificaciones" && (
              <p className="text-gray-600 text-center mt-10">
                No tienes notificaciones nuevas.
              </p>
            )}
            {activeTab === "guardados" && (
              <p className="text-gray-600 text-center mt-10">
                Aún no tienes publicaciones guardadas.
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Botones flotantes */}
      <button className="fixed bottom-6 left-6 bg-blue-200 p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-40">
        <PlusCircle className="w-6 h-6 text-blue-700" />
      </button>

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
              </div>
            </div>

            {/* Content Column */}
            <div>
              <h3 className="font-semibold mb-4">Contenido de FeedYou</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <NavLink to="/feed" className="hover:text-white cursor-pointer">
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
