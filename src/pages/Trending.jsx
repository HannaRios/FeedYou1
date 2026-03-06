import { useState } from "react";
import Navbar from "../components/Navbar";
import ChatBot from "../components/ChatBot";
import CreatePost from "../components/CreatePost";
import { Bot, PlusCircle } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";

export default function Trending() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

const fetchTrending = async () => {
  try {

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/publicaciones/trending/${user.email}`
    );

    const data = await res.json();

    console.log("Trending posts:", data);

    setPosts(data);

  } catch (error) {
    console.error("Error cargando tendencias:", error);
  } finally {
    setLoading(false);
  }
};
    fetchTrending();

}, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 tracking-tight text-center">
          Tendencias
        </h2>

          {loading ? (
            <p className="text-gray-400">Cargando tendencias...</p>
          ) : posts.length === 0 ? (

            <p className="text-gray-400">
              Aún no hay tendencias en tus intereses.
            </p>

          ) : (

            <div className="space-y-6">

              {posts.map((post) => (
                <PostCard key={post.id_publicacion} post={post} />
              ))}

            </div>

          )}
      </div>

      {/* Botón crear publicación */}
      <button
        onClick={() => setIsCreatePostOpen(true)}
        className="fixed bottom-6 left-6 bg-blue-200 p-4 rounded-full shadow-lg"
      >
        <PlusCircle className="w-6 h-6 text-blue-700" />
      </button>

      {/* Botón YouBot */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-blue-200 p-4 rounded-full shadow-lg"
      >
        <Bot className="w-6 h-6 text-blue-700" />
      </button>

      {isChatOpen && (
        <ChatBot onClose={() => setIsChatOpen(false)} />
      )}

    <CreatePost
      isOpen={isCreatePostOpen}
      onClose={() => setIsCreatePostOpen(false)}
    />
    </div>
  );
}