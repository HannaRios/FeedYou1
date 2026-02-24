import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Search } from "lucide-react";
import Logo from "./Logo";
import { useSearch } from "../context/SearchContext.jsx";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;


export default function Navbar() {
  const { isSearchOpen, setIsSearchOpen, query, setQuery } = useSearch();

  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: "Usuario",
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
        photo: data.foto_perfil
          ? data.foto_perfil.startsWith("http")
              ? data.foto_perfil
              : `${API_URL}${data.foto_perfil}`
          : `${API_URL}/uploads/perfiles/default.png`,
      });

    } catch (error) {

      console.error("Error cargando perfil navbar:", error);

    }

  };

  loadProfile();

}, [user]);


  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Logo size="md" showText={false} />
          <h1 className="text-xl font-bold">FeedYou</h1>
        </div>

        {/* Navegación */}
        <div className="flex items-center gap-6">

          {/* Botón búsqueda */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          <NavLink
            to="/feed"
            className={({ isActive }) =>
              `font-medium ${
                isActive ? "text-purple-600" : "text-gray-600 hover:text-gray-800"
              }`
            }
          >
            Para ti
          </NavLink>

          <NavLink
            to="/trending"
            className={({ isActive }) =>
              `font-medium ${
                isActive ? "text-purple-600" : "text-gray-600 hover:text-gray-800"
              }`
            }
          >
            Tendencias
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `font-medium ${
                isActive ? "text-purple-600" : "text-gray-600 hover:text-gray-800"
              }`
            }
          >
            Favoritos
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `font-medium ${
                isActive ? "text-purple-600" : "text-gray-600 hover:text-gray-800"
              }`
            }
          >
            Categorías
          </NavLink>
        </div>

        {/* Perfil */}
        <NavLink to="/profile" className="flex items-center gap-2">
          <img
            src={profile.photo || `${API_URL}/uploads/perfiles/default.png`}
            alt="Perfil"
            className="w-8 h-8 rounded-full object-cover border"
          />
        <span className="font-medium">{profile.name}</span>
        </NavLink>
      </div>

      {/* MODAL DE BÚSQUEDA */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-start pt-32 z-[9999]"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-2xl p-6 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Buscar en FeedYou..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-gray-100 rounded-full px-5 py-3 outline-none"
              />
              <button className="bg-blue-200 px-6 py-2 rounded-full font-medium">
                Buscar
              </button>
            </div>

            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
