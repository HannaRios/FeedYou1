import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function EditProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    nombre: "",
    username: "",
    email: "",
    bio: "",
    telefono: "",
    ciudad: "",
    foto_perfil: ""
  });
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (user?.email) {
      fetch(`${API_URL}/api/usuarios/perfil-completo/${user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.user) setFormData({
            nombre: data.user.nombre || "",
            username: data.user.username || "",
            email: data.user.email || "",
            bio: data.user.bio || "",
            telefono: data.user.telefono || "",
            ciudad: data.user.ciudad || "",
            foto_perfil: data.user.foto_perfil || ""
          });
        });
    }
  }, [user]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("foto", file);
    data.append("email", user.email);

    try {
      const res = await fetch(`${API_URL}/api/usuarios/foto-perfil`, {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (res.ok) setFormData({ ...formData, foto_perfil: result.foto_perfil });
    } catch (err) { console.error("Error subiendo foto", err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/api/usuarios/actualizar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: user.email,
        ...formData 
      })
    });

    if (res.ok) {
      setShowToast(true);
      setTimeout(() => navigate("/profile"), 2000);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-feedyou pb-10 font-sans pt-4">
        <div className="w-[95%] sm:max-w-xl mx-auto mt-4 sm:mt-8 p-6 sm:p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 mb-8 hover:text-blue-400 transition font-bold text-sm tracking-tight">
          <ArrowLeft className="mr-2" size={18} /> VOLVER AL PERFIL
        </button>

        <div className="flex flex-col items-center mb-10">
          <div className="relative group mt-10">
            <img 
              src={formData.foto_perfil ? `${API_URL}${formData.foto_perfil}` : `${API_URL}/uploads/perfiles/default.png`} 
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
              alt="Preview"
            />
            <label className="absolute bottom-1 right-1 bg-blue-200 p-2 rounded-full text-blue-700 cursor-pointer hover:bg-blue-300 transition shadow-md">
              <Camera size={18} />
              <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
            </label>
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-800">{formData.nombre}</h2>
          <p className="text-blue-400 font-semibold text-sm">@{formData.username}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 tracking-wider">Nombre</label>
              <input 
                type="text" value={formData.nombre} 
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-300 transition text-sm text-gray-700"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 tracking-wider">Usuario (@)</label>
              <input 
                type="text" value={formData.username} 
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-300 transition text-sm text-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 tracking-wider">Correo</label>
              <input 
                type="email" value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-300 transition text-sm text-gray-700"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 tracking-wider">Teléfono</label>
              <input 
                type="text" value={formData.telefono} 
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-300 transition text-sm text-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 tracking-wider">Biografía</label>
            <textarea 
              value={formData.bio} 
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="w-full p-4 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-300 transition h-28 resize-none text-sm text-gray-700"
              placeholder="Cuéntanos sobre ti..."
            />
          </div>

          {/* BOTÓN*/}
          <button 
            type="submit" 
            className="w-full bg-blue-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-blue-300 transition shadow-sm text-sm active:scale-95"
          >
            Guardar Cambios
          </button>
        </form>
      </div>

      {showToast && (
        <div className="fixed bottom-10 right-10 bg-blue-600 text-white px-8 py-4 rounded-3xl flex items-center gap-3 shadow-2xl animate-fade-in-up font-bold text-sm">
          <CheckCircle2 size={20} /> PERFIL ACTUALIZADO
        </div>
      )}
      </div>
    </>
  );
}