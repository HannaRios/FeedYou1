import { NavLink } from "react-router-dom";
import { Search } from "lucide-react";
import Logo from "./Logo";
import { useState } from "react"
import { useSearch } from "../Context/SearchContext";


export default function Navbar() {
  const { isSearchOpen, setIsSearchOpen, query, setQuery } = useSearch();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Logo size="md" showText={false} />
          <h1 className="text-xl font-bold text-gray-800">FeedYou</h1>
        </div>

        {/* Links de navegación */}
        <div className="flex items-center gap-6">
          
        {/* búsqueda */}
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
        <NavLink
          to="/profile"
          className="flex items-center gap-2 text-gray-700 font-medium hover:text-gray-900"
        >
          <img
            src="/profile.jpg" 
            alt="Foto de perfil"
            className="w-8 h-8 rounded-full object-cover border border-gray-300"
          />
          <span>Andrea Gómez</span>
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
      {/* Header */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Playlist relajante para trabajar"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-gray-100 rounded-full px-5 py-3 outline-none"
        />
        <button className="bg-blue-200 px-6 py-2 rounded-full font-medium">
          Buscar
        </button>
      </div>

      <hr className="my-6" />

      {/* Recientes */}
      <h3 className="text-lg font-semibold mb-4">Recientes</h3>

      <ul className="space-y-3">
        {[
          "Libros de ficción contemporánea recomendados 2025",
          "Música lo-fi con estética vintage",
          "Nuevos artistas de reggaetón emergentes",
          "Ropa oversize para verano",
          "Crítica de Dune Parte 2",
          "Películas basadas en hechos reales",
        ].map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <span>{item}</span>
            <button className="text-gray-400 hover:text-black">✕</button>
          </li>
        ))}
      </ul>

      {/* Cerrar */}
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
