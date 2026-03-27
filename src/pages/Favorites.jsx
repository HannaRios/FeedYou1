import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import ChatBot from "../components/ChatBot";
import { Bot, PlusCircle } from "lucide-react";
import CreatePost from "../components/CreatePost";

const API_URL = import.meta.env.VITE_API_URL;

export default function Favorites() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  console.log(posts);

  useEffect(() => {
    if (!user?.email) return;

    const fetchFavoritos = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/interacciones/favoritos/${user.email}`
        );

        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Error cargando favoritos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritos();
  }, [user]);

  const handleUnfavoriteLocal = (id_publicacion) => {
    setPosts((prev) =>
      prev.filter((post) => post.id_publicacion !== id_publicacion)
    );
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 pt-20 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8 tracking-tight text-center">
            Favoritos
          </h1>

          {loading && <p>Cargando...</p>}

          {!loading && posts.length === 0 && (
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <p className="text-gray-500">
                Aún no tienes publicaciones favoritas.
              </p>
            </div>
          )}

          {posts.map((post) => (
            <PostCard
              key={post.id_publicacion}
              post={post}
              onUnfavorite={handleUnfavoriteLocal}
            />
          ))}
        </div>
      </div>

{/* Botón crear publicación */}
<button
  onClick={() => setIsCreatePostOpen(true)}
  className="fixed bottom-4 left-4 md:bottom-6 md:left-6 bg-blue-200 p-3 md:p-4 rounded-full shadow-lg z-40"
>
  <PlusCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-700" />
</button>

{/* Botón YouBot */}
<button
  onClick={() => setIsChatOpen(!isChatOpen)}
  className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-blue-200 p-3 md:p-4 rounded-full shadow-lg z-40"
>
  <Bot className="w-5 h-5 md:w-6 md:h-6 text-blue-700" />
</button>

<ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

<CreatePost
  isOpen={isCreatePostOpen}
  onClose={() => setIsCreatePostOpen(false)}
/>
    </>
  );
}