import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Logo from "./Logo";
import { useSearch } from "../Context/SearchContext";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;


export default function Navbar() {
  const { isSearchOpen, setIsSearchOpen, query, setQuery } = useSearch();;
  const navigate = useNavigate();

  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
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


useEffect(() => {
  if (!query || query.trim() === "") {
    setResults([]);
    return;
  }

  const buscarUsuarios = async () => {
    try {
      setLoadingSearch(true);

      const res = await fetch(
        `${API_URL}/api/usuarios/buscar?q=${query}&currentEmail=${user?.email}`
      );

      const data = await res.json();
      setResults(data);

    } catch (error) {
      console.error("Error buscando usuarios:", error);
    } finally {
      setLoadingSearch(false);
    }
  };

  const delay = setTimeout(() => {
    buscarUsuarios();
  }, 300); 

  return () => clearTimeout(delay);

}, [query, user]);


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
            type="button"
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

{/* ========================= MODAL BÚSQUEDA ========================= */}
{isSearchOpen && (
  <div
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    onClick={() => {
      setIsSearchOpen(false);
      setQuery("");
      setResults([]);
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white w-full max-w-2xl h-[75vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative animate-fade-in-up"
    >
      {/* LOGO */}
      <div className="absolute top-4 left-4">
        <img src="/logo.png" alt="FeedYou" className="h-10" />
      </div>

      {/* BOTÓN CERRAR */}
      <button
        onClick={() => {
          setIsSearchOpen(false);
          setQuery("");
          setResults([]);
        }}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
      >
        ✕
      </button>

      {/* HEADER */}
      <div className="pt-16 px-8 pb-6 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-100 pl-12 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 transition"
          />
        </div>
      </div>

      {/* RESULTADOS */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        {!query && (
          <p className="text-sm text-gray-300 text-center">
            Empieza a escribir para buscar usuarios.
          </p>
        )}

        {loadingSearch && (
          <p className="text-sm text-gray-400">Buscando...</p>
        )}

        {!loadingSearch && results.length === 0 && query && (
          <p className="text-sm text-gray-400">
            No se encontraron usuarios.
          </p>
        )}

      {results.map((userResult, index) => (
        <div
          key={index}
          onClick={() => {
            navigate(`/profile/${userResult.email}`);
            setIsSearchOpen(false);
            setQuery("");
            setResults([]);
          }}
          className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition duration-200"
        >
          <img
            src={
              userResult.foto_perfil
                ? userResult.foto_perfil.startsWith("http")
                  ? userResult.foto_perfil
                  : `${API_URL}${userResult.foto_perfil}`
                : "/avatar-default.png"
            }
            alt="avatar"
            className="w-12 h-12 rounded-full object-cover"
          />

          <div className="flex flex-col">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">
                  {userResult.username || userResult.email.split("@")[0]}
                </span>

                <span className="text-sm text-gray-400">
                  {userResult.nombre}
                </span>
              </div>
          </div>
        </div>
      ))}
      </div>
    </div>
  </div>
)}

    </nav>
  );
}