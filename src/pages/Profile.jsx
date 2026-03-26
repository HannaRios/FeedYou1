import { useEffect, useState } from "react";
import { Settings, Bot, PlusCircle, LogOut, Edit3, MapPin, Grid, Bell, Sliders, X, Film, Music, Dumbbell, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ChatBot from "../components/ChatBot";
import CreatePost from "../components/CreatePost";
import PostDetail from "../components/PostDetail";
import Notifications from "../components/Notifications";
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
  const [modalUsers, setModalUsers] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    user: {},
    posts: [],
    preferencias: [],
    stats: { seguidores: 0, seguidos: 0, postCount: 0 }
  });

  // 🔄 Cargar perfil
  const loadProfile = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`${API_URL}/api/usuarios/perfil-completo/${user.email}`);
      const data = await res.json();
      if (res.ok) setProfileData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfile(); }, [user]);

  // 🔄 Seguidores / seguidos
  const loadFollowData = async (type) => {
    try {
      const res = await fetch(`${API_URL}/api/usuarios/${type}/${user.email}`);
      const data = await res.json();
      if (res.ok) {
        setModalUsers(data);
        setShowModal(type);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Cargando...</div>;

  const { user: userData, posts, stats, preferencias } = profileData;

  // 🎨 Agrupar preferencias
  const preferenciasAgrupadas = preferencias.reduce((acc, pref) => {
    if (!acc[pref.nombre_categoria]) acc[pref.nombre_categoria] = [];
    acc[pref.nombre_categoria].push(pref.hashtag_subcategoria);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      <div className="max-w-3xl mx-auto mt-6 px-6">

        {/* PERFIL */}
        <div className="bg-white p-6 rounded-3xl">
          <div className="flex gap-6">
            <img
              src={
                userData.foto_perfil
                  ? userData.foto_perfil.startsWith("http")
                    ? userData.foto_perfil
                    : `${API_URL}${userData.foto_perfil}`
                  : "/avatar-default.png"
              }
              className="w-24 h-24 rounded-full object-cover"
            />

            <div className="flex-1">

              <div className="flex justify-between">
                <div>
                  <h1 className="text-xl font-bold">{userData.nombre}</h1>
                  <p className="text-blue-500">@{userData.username}</p>
                </div>

                <button onClick={() => setMenuOpen(!menuOpen)}>
                  <Settings />
                </button>
              </div>

              {menuOpen && (
                <div className="bg-white border mt-2 rounded-xl absolute">
                  <button onClick={() => navigate("/edit-profile")}>Editar</button>
                  <button onClick={handleLogout}>Salir</button>
                </div>
              )}

              <p className="mt-2 text-sm">{userData.bio}</p>

              <div className="flex gap-6 mt-4">
                <div>{stats.postCount} Posts</div>

                <button onClick={() => loadFollowData("seguidores")}>
                  {stats.seguidores} Seguidores
                </button>

                <button onClick={() => loadFollowData("seguidos")}>
                  {stats.seguidos} Seguidos
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex justify-around mt-6">
          <button onClick={() => setActiveTab("posts")}>Posts</button>
          <button onClick={() => setActiveTab("preferencias")}>Preferencias</button>
          <button onClick={() => setActiveTab("notificaciones")}>Notificaciones</button>
        </div>

        {/* CONTENIDO */}
        <div className="mt-6">

          {/* POSTS */}
          {activeTab === "posts" && (
            <div className="grid grid-cols-3 gap-2">
              {posts.map(post => (
                <img
                  key={post.id_publicacion}
                  src={post.url_media ? `${API_URL}${post.url_media}` : "/avatar-default.png"}
                  onClick={() => {
                    setSelectedPost(post);
                    setShowPostModal(true);
                  }}
                  className="cursor-pointer"
                />
              ))}
            </div>
          )}

          {/* PREFERENCIAS */}
          {activeTab === "preferencias" && (
            <div>
              {Object.entries(preferenciasAgrupadas).map(([cat, subs]) => (
                <div key={cat}>
                  <h3>{cat}</h3>
                  {subs.map(s => <span key={s}>{s}</span>)}
                </div>
              ))}
            </div>
          )}

          {/* NOTIFICACIONES */}
          {activeTab === "notificaciones" && (
            <Notifications />
          )}

        </div>
      </div>

      {/* MODAL USUARIOS */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6">
            {modalUsers.map(u => (
              <div key={u.email}>{u.username}</div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL POST */}
      {showPostModal && selectedPost && (
        <PostDetail postId={selectedPost.id_publicacion} />
      )}

      {/* BOTONES */}
      <button onClick={() => setIsCreatePostOpen(true)}>+</button>
      <button onClick={() => setIsChatOpen(true)}>Bot</button>

      <CreatePost isOpen={isCreatePostOpen} onClose={() => setIsCreatePostOpen(false)} />
      {isChatOpen && <ChatBot onClose={() => setIsChatOpen(false)} />}

    </div>
  );
}