import { NavLink } from "react-router-dom";
import { Search } from "lucide-react";
import Logo from "./Logo";

export default function Navbar() {
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

        {/* Barra de búsqueda */}
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 w-64 shadow-inner">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar en FeedYou..."
            className="bg-transparent ml-2 outline-none text-gray-700 w-full placeholder-gray-500"
          />
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
          <span>Hanna Rios</span>
        </NavLink>
      </div>
    </nav>
  );
}
