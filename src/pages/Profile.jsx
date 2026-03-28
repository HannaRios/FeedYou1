import { useEffect, useState } from "react";
import { Settings, Bot, PlusCircle, LogOut, Edit3, MapPin, Grid, Bell, Sliders, X, Film,  Music, Dumbbell, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ChatBot from "../components/ChatBot";
import CreatePost from "../components/CreatePost";
import { useAuth } from "../context/AuthContext";
import PostDetail from "../components/PostDetail";
import Notifications from "../components/Notifications";

const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [modalUsers, setModalUsers] = useState([]);
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

  const loadFollowData = async (type) => {
  try {
    const res = await fetch(
      `${API_URL}/api/usuarios/${type}/${user.email}`
    );
    const data = await res.json();
    if (res.ok) {
      setModalUsers(data);
      setShowModal(type);
    }
  } catch (error) {
    console.error("Error cargando seguidores:", error);
  }
};

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
  
  const iconosCategoria = {
  Moda: Grid,
  Belleza: Sliders,
  Gastronomía: Utensils,
  Arte: Edit3,
  Música: Music,
  Deporte: Dumbbell,
  Cine: Film,
  Turismo: MapPin,
  Literatura: Edit3
};

const coloresCategoria = {
  Moda: "#E6E6FA",
  Belleza: "#FADADD",
  Gastronomía: "#FFE5B4",
  Arte: "#F5E6FF",
  Música: "#E0F2FE",
  Deporte: "#D0F0FD",
  Cine: "#E9D5FF",
  Turismo: "#E8F8F5",
  Literatura: "#FDE2E4"
};

const colorCategoria = {
  Cine: "#E9D5FF",
  Deporte: "#D0F0FD",
  Arte: "#FADADD",
  Gastronomía: "#FFE5B4",
  Música: "#E6E6FA",
  Moda: "#FFD6E8",
  Belleza: "#FDE2E4",
  Turismo: "#E8F8F5",
  Literatura: "#F5E6FF"
};

  const preferenciasAgrupadas = preferencias.reduce((acc, pref) => {
  if (!acc[pref.nombre_categoria]) {
    acc[pref.nombre_categoria] = [];
  }

  acc[pref.nombre_categoria].push(pref.hashtag_subcategoria);
  return acc;
}, {});

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <Navbar />

      <div className="max-w-3xl mx-auto mt-6 px-6">
        {/* CABECERA */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
            <img
              src={
                    userData.foto_perfil
                      ? userData.foto_perfil.startsWith("http")
                        ? userData.foto_perfil
                        : `${API_URL}${userData.foto_perfil}`
                      : `${API_URL}/uploads/perfiles/default.png`
                  }
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-sm"
              alt="Perfil"
            />
            
              <div className="flex-1 flex flex-col w-full">

                {/* NOMBRE + CONFIGURACIÓN */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between w-full">
                  <div className="flex flex-col items-center sm:items-start">
                    <h1 className="text-2xl font-bold text-gray-800 leading-tight">
                      {userData.nombre}
                    </h1>

                    <p className="text-sm text-blue-500 font-medium -mt-1 mb-2 sm:mb-0">
                      @{userData.username}
                    </p>
                  </div>

                  <div className="relative mt-2 sm:mt-0 flex justify-center w-full sm:w-auto">
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="py-1.5 px-4 sm:p-2 sm:px-2 bg-gray-100 sm:bg-transparent hover:bg-gray-200 sm:hover:bg-gray-100 rounded-full transition text-gray-600 sm:text-gray-400 font-bold flex items-center gap-2"
                    >
                      <Settings size={18} className="sm:w-[22px] sm:h-[22px]" />
                      <span className="text-xs sm:hidden"></span>
                    </button>

                    {menuOpen && (
                      <div className="absolute top-10 sm:top-10 sm:right-0 mt-2 w-44 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
                        <button
                          onClick={() => navigate("/edit-profile")}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-blue-50 text-gray-600 text-sm transition"
                        >
                          <Edit3 size={16} /> Editar Perfil
                        </button>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-500 text-sm border-t transition"
                        >
                          <LogOut size={16} /> Cerrar Sesión
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* BIO */}
                <p className="text-gray-600 text-sm leading-relaxed mt-3 max-w-md mx-auto sm:mx-0">
                  {userData.bio || "Escribe algo interesante sobre ti..."}
                </p>

                {/* STATS */}
                <div className="flex justify-center sm:justify-start gap-6 sm:gap-10 mt-5">
                  <div className="text-center">
                    <span className="block font-bold text-gray-800">
                      {stats.postCount}
                    </span>
                    <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                      Publicaciones
                    </span>
                  </div>

                  <button
                    onClick={() => loadFollowData("seguidores")}
                    className="text-center hover:opacity-60 transition"
                  >
                    <span className="block font-bold text-gray-800">
                      {stats.seguidores}
                    </span>
                    <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                      Seguidores
                    </span>
                  </button>

                  <button
                    onClick={() => loadFollowData("seguidos")}
                    className="text-center hover:opacity-60 transition"
                  >
                    <span className="block font-bold text-gray-800">
                      {stats.seguidos}
                    </span>
                    <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                      Seguidos
                    </span>
                  </button>
                </div>

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
      className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 sm:py-4 px-2 sm:px-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest relative transition ${
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
                <div
                      key={post.id_publicacion}
                      onClick={() => {
                        setSelectedPost(post);
                        setShowPostModal(true);
                      }}
                      className="aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition"
                    >
                  <img
                      src={
                        post.url_media
                          ? post.url_media.startsWith("http")
                            ? post.url_media
                            : `${API_URL}${post.url_media}`
                          : `${API_URL}/uploads/perfiles/default.png`
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
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#111",
                  textAlign: "center",
                  marginBottom: "25px",
                  letterSpacing: "2px"
                }}
              >
                MIS INTERESES DETECTADOS
              </h3>
              

            <div className="grid md:grid-cols-2 gap-5">

            {Object.entries(preferenciasAgrupadas).map(([categoria, subs]) => {

              const Icon = iconosCategoria[categoria];

              return (
                <div
                  key={categoria}
                  className="rounded-2xl p-5 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  style={{
                    border: `2px solid ${coloresCategoria[categoria] || "#E5E7EB"}`
                  }}
                >

                  <div className="flex items-center gap-2 mb-3">

                    <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "10px",
                          background: colorCategoria[categoria] || "#F1F5F9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        {Icon && <Icon size={18} color="#444" />}
                      </div>

                    <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-widest">
                      {categoria}
                    </h4>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {subs.map((sub, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-[11px] font-semibold border border-blue-200 hover:scale-105 transition"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
            </div>
            
            <div className="flex justify-center mt-6">
              <button
                onClick={() => navigate("/interest-test")}
                className="px-4 py-2 text-sm border bg-blue-200 rounded-lg hover:bg-gray-100 transition"
              >
                Editar intereses
              </button>
            </div>
            </div>
            
          )}
          

      {activeTab === "notificaciones" && (
            <Notifications
            openPost={(id)=>{
            setSelectedPost({id_publicacion:id});
            setShowPostModal(true);
          }}
        />
      )}
        </div>
      </div>

      {/* MODAL DE SEGUIDORES/SEGUIDOS */}
{showModal && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl w-[90%] sm:w-[480px] h-[80vh] sm:max-h-[75vh] shadow-2xl relative flex flex-col">

      {/* LOGO */}
      <div className="absolute top-6 left-6">
        <img
          src="/logo.png"
          alt="FeedYou"
          className="h-8 object-contain"
        />
      </div>

      {/* BOTÓN CERRAR */}
      <button
        onClick={() => setShowModal(null)}
        className="absolute top-6 right-6 text-gray-400 hover:text-gray-700"
      >
        <X size={22} />
      </button>

      {/* TÍTULO */}
      <div className="text-center pt-16 pb-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800 tracking-tight">
          {showModal === "seguidores" ? "Seguidores" : "Seguidos"}
        </h3>
      </div>

      {/* LISTA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {modalUsers.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-10">
            No hay usuarios aún.
          </p>
        ) : (
              modalUsers.map((u) => (
                <div
                  key={u.email}
                  onClick={() => {
                    setShowModal(null);
                    navigate(`/usuario/${u.email}`);
                  }}
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
                >
              <div className="flex items-center gap-3">
                <img
                  src={
                    u.foto_perfil
                      ? u.foto_perfil.startsWith("http")
                        ? u.foto_perfil
                        : `${API_URL}${u.foto_perfil}`
                      : `${API_URL}/uploads/perfiles/default.png`
                  }
                  className="w-10 h-10 rounded-full object-cover"
                  alt="avatar"
                />

                <div>
                  <p className="font-semibold text-sm text-gray-800">
                    {u.username}
                  </p>
                  <p className="text-xs text-gray-400">
                    {u.nombre}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  </div>
)}

{showPostModal && selectedPost && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
<div className="bg-white w-[95%] sm:w-[600px] h-[90vh] sm:max-h-[90vh] rounded-3xl shadow-2xl relative flex flex-col overflow-hidden">
    

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">

        <img src="/logo.png" className="h-11" alt="FeedYou" />

        <button
          onClick={() => setShowPostModal(false)}
          className="text-gray-400 hover:text-gray-800 transition"
        >
          <X size={20} />
        </button>

      </div>

      {/* CONTENIDO */}
      <div className="flex justify-center py-6 px-6 flex-1 overflow-y-auto min-h-0">

        <div className="h-full overflow-y-auto">
          <PostDetail 
            postId={selectedPost.id_publicacion} 
            isModal 
          />
        </div>
      </div>
    </div>
  </div>
)}

      {/* TUS BOTONES FLOTANTES (ESTILO EXACTO) */}
      <button 
        onClick={() => setIsCreatePostOpen(true)}
        className="fixed bottom-4 left-4 md:bottom-6 md:left-6 bg-blue-200 p-3 md:p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-40"
      >
        <PlusCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-700" />
      </button>

      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-blue-200 p-3 md:p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-40"
      >
        <Bot className="w-5 h-5 md:w-6 md:h-6 text-blue-700" />
      </button>

      <CreatePost isOpen={isCreatePostOpen} onClose={() => setIsCreatePostOpen(false)} onPublicacionCreada={loadProfile} />
      {isChatOpen && <ChatBot onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}