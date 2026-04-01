import { useEffect, useState } from "react";
import { ChevronDown, PlusCircle, Bot } from "lucide-react";
import CreatePost from "../components/CreatePost";
import ChatBot from "../components/ChatBot";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import { fetchFeedSeguidos } from "../services/feedService";

export default function SeguidosPage() {

  const { user } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  useEffect(() => {

    if (!user) return;

    const loadPosts = async () => {

      try {

        const data = await fetchFeedSeguidos(user.email);

        setPosts(data);

      } catch (error) {

        console.error("Error cargando seguidos:", error);

      } finally {

        setLoading(false);

      }
    };

    loadPosts();

  }, [user]);


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-feedyou pt-4">

      <div className="flex justify-center px-4 py-6">

        <div className="w-full max-w-4xl flex flex-col gap-6">

          {/* SELECTOR PARA TI / SEGUIDOS */}
          <div className="relative flex justify-center border-b pb-3">

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 font-semibold text-gray-900"
            >
              Seguidos
              <ChevronDown className="w-4 h-4" />
            </button>

            {showMenu && (

              <div className="absolute top-10 bg-white border rounded-lg shadow-md w-40 z-50">

                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/feed");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-600"
                >
                  Para ti
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/seguidos");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 font-medium"
                >
                  Seguidos
                </button>

              </div>

            )}

          </div>

          {/* POSTS */}

          {loading ? (

            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>

          ) : posts.length === 0 ? (

            <div className="text-center py-20">
              <div className="text-5xl mb-4">👥</div>
              <h2 className="text-xl font-bold text-gray-800">
                No hay publicaciones de tus seguidos
              </h2>
            </div>

          ) : (

            posts.map((post) => (
              <PostCard key={post.id_publicacion} post={post} />
            ))

          )}

        </div>

      </div>

    </div>

      {/* Botón flotante para crear publicación */}
      <button
        onClick={() => setIsCreatePostOpen(true)}
        className="fixed bottom-4 left-4 md:bottom-6 md:left-6 bg-blue-200 p-3 md:p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-40"
      >
        <PlusCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-700" />
      </button>

      {/* Botón flotante YouBot */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-blue-200 p-3 md:p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-40"
      >
        <Bot className="w-5 h-5 md:w-6 md:h-6 text-blue-700" />
      </button>

      {isChatOpen && (
        <ChatBot onClose={() => setIsChatOpen(false)} />
      )}

      <CreatePost
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
    </>
  );
}