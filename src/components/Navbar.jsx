import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Search } from "lucide-react";
import Logo from "./Logo";

export default function Navbar() {
  const [profile, setProfile] = useState({
    name: "Usuario",
    photo: "/profile.jpg",
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem("profileData");
    if (savedProfile) {
      const data = JSON.parse(savedProfile);
      setProfile({ name: data.name, photo: data.photo });
    }
  }, []);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <div className="flex items-center gap-2">
          <Logo size="md" showText={false} />
          <h1 className="text-xl font-bold">FeedYou</h1>
        </div>

        <div className="flex gap-6">
          {["feed", "trending", "favorites", "categories"].map(r => (
            <NavLink
              key={r}
              to={`/${r}`}
              className={({ isActive }) =>
                `font-medium ${
                  isActive ? "text-purple-600" : "text-gray-600"
                }`
              }
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 w-64">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            placeholder="Buscar en FeedYou..."
            className="bg-transparent ml-2 outline-none w-full"
          />
        </div>

        <NavLink to="/profile" className="flex items-center gap-2">
          <img
            src={profile.photo}
            className="w-8 h-8 rounded-full object-cover border"
          />
          <span className="font-medium">{profile.name}</span>
        </NavLink>

      </div>
    </nav>
  );
}
