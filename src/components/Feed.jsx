import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchFeed } from "../services/feedService";
import PostCard from "./PostCard";
import { useAuth } from "../context/AuthContext";
import ChatBot from "./ChatBot";

const API_URL = import.meta.env.VITE_API_URL;

function Feed() {
  const { user } = useAuth();
  const [feed, setFeed] = useState(() => {
    const cached = sessionStorage.getItem('cached_main_feed');
    return cached ? JSON.parse(cached) : [];
  });
  
  // Si tenemos publicaciones cacheadas, mostramos directamente y no el indicador de carga inicial
  const [loading, setLoading] = useState(feed.length === 0);
  
  const [hasInterests, setHasInterests] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const navigate = useNavigate();

  const isImageValid = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  };

  useEffect(() => {
    if (!user) return; 
    
    const loadFeed = async () => {
      try {
        if (!user?.email) {
          setHasInterests(false);
          setLoading(false);
          return;
        }

        const data = await fetchFeed(user.email);
        console.log("Feed recibido:", data);

        const validatedFeed = await Promise.all(
          data.map(async (post) => {
            if (!post.url_media) return post;

            const imageUrl = post.url_media.startsWith("http")
              ? post.url_media
              : `${API_URL}${post.url_media}`;

            const valid = await isImageValid(imageUrl);
            return valid ? post : null;
          })
        );

        const filteredFeed = validatedFeed.filter(Boolean);
        
        // Mezclar publicaciones aleatoriamente
        const shuffledFeed = [...filteredFeed].sort(() => Math.random() - 0.5);
        setFeed(shuffledFeed);
        sessionStorage.setItem('cached_main_feed', JSON.stringify(shuffledFeed));

        if (shuffledFeed.length === 0) {
          setHasInterests(false);
        }
      } catch (error) {
        console.error("Error cargando feed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!hasInterests) {
    return (
      <div className="flex justify-center py-20">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🧠</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Aún no hay publicaciones para ti
          </h2>
          <p className="text-gray-600">
            Realiza el test de intereses o espera nuevas publicaciones relacionadas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center px-4 py-6">
      <div className="w-full max-w-4xl flex flex-col gap-6">

        <div className="relative flex justify-center border-b pb-3">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 font-semibold text-gray-900"
          >
            Para ti
            <ChevronDown className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute top-10 bg-white border rounded-lg shadow-md w-40 z-50">
              <button
                onClick={() => {
                  setShowMenu(false);
                  navigate("/feed");
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 font-medium"
              >
                Para ti
              </button>

              <button
                onClick={() => {
                  setShowMenu(false);
                  navigate("/seguidos");
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-600"
              >
                Seguidos
              </button>
            </div>
          )}

        </div>

        {feed.map((item) => (
          <PostCard key={item.id_publicacion} post={item} />
        ))}

      </div>


      {chatOpen && <ChatBot onClose={() => setChatOpen(false)} />}
    </div>
  );
}

export default Feed;