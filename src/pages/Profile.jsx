import { useEffect, useState } from "react";
import { Settings, Bot, PlusCircle, LogOut, Edit3, MapPin, Grid, Bell, Sliders, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ChatBot from "../components/ChatBot";
import CreatePost from "../components/CreatePost";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("posts");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(null); 
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    user: {},
    posts: [],
    preferencias: [],
    stats: { seguidores: 0, seguidos: 0, postCount: 0 }
  });

  const loadProfile = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`${API_URL}/api/usuarios/perfil-completo/${user.email}`);
      const data = await res.json();
      if (res.ok) setProfileData(data);
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfile(); }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-blue-600 font-medium italic">Cargando FeedYou...</div>;

  const { user: userData, posts, stats, preferencias } = profileData;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <Navbar />

      <div className="max-w-2xl mx-auto mt-6 px-4">
        {/* CABECERA */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-6">
            <img
              src={
                    userData.foto_perfil
                      ? userData.foto_perfil.startsWith("http")
                        ? userData.foto_perfil
                        : `${API_URL}${userData.foto_perfil}`
                      : "/avatar-default.png"
                  }
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
              alt="Perfil"
            />
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{userData.nombre}</h1>
                
                <div className="relative">
                  <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400">
                    <Settings size={22} />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
                      <button onClick={() => navigate("/edit-profile")} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-blue-50 text-gray-600 text-sm transition">
                        <Edit3 size={16} /> Editar Perfil
                      </button>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-500 text-sm border-t transition">
                        <LogOut size={16} /> Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-blue-500 font-semibold text-sm">@{userData.username}</p>
              
              <div className="flex gap-8 my-3">
                <div className="text-center">
                  <span className="block font-bold text-gray-800">{stats.postCount}</span>
                  <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Posts</span>
                </div>
                <button onClick={() => setShowModal('seguidores')} className="text-center hover:opacity-60 transition">
                  <span className="block font-bold text-gray-800">{stats.seguidores}</span>
                  <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Seguidores</span>
                </button>
                <button onClick={() => setShowModal('seguidos')} className="text-center hover:opacity-60 transition">
                  <span className="block font-bold text-gray-800">{stats.seguidos}</span>
                  <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Seguidos</span>
                </button>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">{userData.bio || "Escribe algo interesante sobre ti..."}</p>
            </div>
          </div>
        </div>

<div className="flex justify-around mt-6 border-b border-gray-200">
  {[
    { id: "posts", icon: <Grid size={16} />, label: "Publicaciones" },
    { id: "preferencias", icon: <Sliders size={16} />, label: "Preferencias" },
    { id: "notificaciones", icon: <Bell size={16} />, label: "Notificaciones" },
  ].map((tab) => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`flex items-center gap-2 py-4 px-4 text-xs font-bold uppercase tracking-widest relative transition ${
        activeTab === tab.id ? "text-[#D4A373]" : "text-gray-400 hover:text-gray-600"
      }`}
      style={activeTab === tab.id ? { color: '#000000' } : {}} 
    >
      {tab.label}
      {activeTab === tab.id && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 rounded-full" 
          style={{ backgroundColor: '#000000' }} 
        />
      )}
    </button>
  ))}
</div>

        {/* CONTENIDO TABS */}
        <div className="mt-6">
          {activeTab === "posts" && (
            <div className="grid grid-cols-3 gap-2">
              {posts.length > 0 ? posts.map((post) => (
                <div key={post.id_publicacion} className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                  <img
                      src={
                        post.url_media
                          ? post.url_media.startsWith("http")
                            ? post.url_media
                            : `${API_URL}${post.url_media}`
                          : "/avatar-default.png"
                      }
                      className="w-full h-full object-cover"
                      alt="Post"
                    />
                </div>
              )) : (
                <p className="col-span-3 text-center py-12 text-gray-400 text-sm italic font-medium">No hay publicaciones disponibles.</p>
              )}
            </div>
          )}

          {activeTab === "preferencias" && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">Mis intereses detectados</h3>
              <div className="flex flex-wrap gap-2">
                {preferencias.map((pref, i) => (
                  <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[11px] font-bold">
                    #{pref.hashtag_subcategoria}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === "notificaciones" && (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400 text-sm">
              Todo al día por aquí.
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE SEGUIDORES/SEGUIDOS */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl scale-in-center">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 uppercase text-sm tracking-widest">{showModal}</h3>
              <button onClick={() => setShowModal(null)} className="p-2 bg-gray-50 rounded-full text-gray-400"><X size={18}/></button>
            </div>
            <p className="text-center py-6 text-gray-400 text-sm">Lista vacía.</p>
          </div>
        </div>
      )}

      {/* TUS BOTONES FLOTANTES (ESTILO EXACTO) */}
      <button 
        onClick={() => setIsCreatePostOpen(true)}
        className="fixed bottom-6 left-6 bg-blue-200 p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-40"
      >
        <PlusCircle className="w-6 h-6 text-blue-700" />
      </button>

      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-blue-200 p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-40"
      >
        <Bot className="w-6 h-6 text-blue-700" />
      </button>

      <CreatePost isOpen={isCreatePostOpen} onClose={() => setIsCreatePostOpen(false)} onPublicacionCreada={loadProfile} />
      {isChatOpen && <ChatBot onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}