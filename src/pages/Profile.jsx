import { useEffect, useState } from "react";
import {
  Settings, Bot, PlusCircle, LogOut, User, Sliders
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ChatBot from "../components/ChatBot";
import CreatePost from "../components/CreatePost";

import { useAuth } from "../context/AuthContext";
const API_URL = import.meta.env.VITE_API_URL;



export default function Profile() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("preferencias");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "Usuario",
    email: "",
    bio: "",
    photo: null,
  });

useEffect(() => {
  const loadProfile = async () => {

    if (!user?.email) return;
    try {
      const res = await fetch(
        `${API_URL}/api/usuarios/${user.email}`
      );

      const data = await res.json();

      setProfile({
        name: data.nombre || "Usuario",
        email: data.email || "",
        bio: data.bio || "",
        photo: data.foto_perfil
          ? data.foto_perfil.startsWith("http")
              ? data.foto_perfil
              : `${API_URL}${data.foto_perfil}`
          : `${API_URL}/uploads/perfiles/default.png`,
      });

    } catch (error) {
      console.error("Error cargando perfil:", error);
    }
  };
  loadProfile();
}, [user]);



const handleLogout = () => {

  logout(); // AuthContext limpia todo

  navigate("/Landing");

};


  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">
      <Navbar />

      <div className="flex-grow bg-[url('/bg-dark.jpg')] bg-cover bg-center flex flex-col items-center pt-10 px-4">
        <div className="bg-white rounded-3xl shadow-lg w-full max-w-4xl p-8 relative">

          {/* Encabezado */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-800">
                ¡{profile.name.split(" ")[0]}!
              </h1>
              <p className="text-gray-600">{profile.name}</p>

                {profile.bio && profile.bio.trim() !== "" && (
                  <p className="text-gray-500 text-sm mt-2 max-w-md">
                    {profile.bio}
                  </p>
                )}
            </div>


            <div className="relative">
            <img
              src={profile.photo || `${API_URL}/uploads/perfiles/default.png`}
              alt="Perfil"
              className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
            />


              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="absolute -bottom-2 -right-2 bg-gray-100 hover:bg-gray-200 p-2 rounded-full shadow"
              >
                <Settings className="w-5 h-5 text-gray-700" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border overflow-hidden">
                  <NavLink
                    to="/edit-profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <User className="w-4 h-4" /> Editar perfil
                  </NavLink>

                  <button className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100">
                    <Sliders className="w-4 h-4" /> Configuración
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4" /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-6 mt-6 border-b pb-2">
            {[
              { id: "preferencias", label: "Tus preferencias" },
              { id: "historial", label: "Historial" },
              { id: "notificaciones", label: "Notificaciones" },
              { id: "guardados", label: "Guardados" },
            ].map(tab => (
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

          {/* Contenido */}
          <div className="mt-6">
            {activeTab === "preferencias" ? (
              <>
                <h2 className="text-lg font-semibold mb-4">Prefieres...</h2>
                <p className="text-gray-500 text-sm">
                  {profile.name.split(" ")[0]}, aquí aparecerán tus preferencias.
                </p>
              </>
            ) : (
              <p className="text-center text-gray-600 mt-10">
                Contenido disponible próximamente.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Botones flotantes */}
      <button
        onClick={() => setIsCreatePostOpen(true)}
        className="fixed bottom-6 left-6 bg-blue-200 p-4 rounded-full shadow-lg"
      >
        <PlusCircle className="w-6 h-6 text-blue-700" />
      </button>


      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-blue-200 p-4 rounded-full shadow-lg"
      >
        <Bot className="w-6 h-6 text-blue-700" />
      </button>

      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <CreatePost
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />

    </div>
  );
}
