import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchFeed } from "../services/feedService";
import PostCard from "./PostCard";
import { useAuth } from "../context/AuthContext";

function Feed() {
  const { user } = useAuth();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasInterests, setHasInterests] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();

useEffect(() => {

  //  LIMPIAR ESTADO ANTES DE CARGAR NUEVO FEED
  setFeed([]);
  setLoading(true);
  setHasInterests(true);

  const loadFeed = async () => {
    if (!user?.email) {

      setHasInterests(false);
      setLoading(false);
      return;
    }

    try {
      const data = await fetchFeed(user.email);

      console.log("Feed recibido:", data);

      setFeed(data);
      if (data.length === 0) {
        setHasInterests(false);
      }

    } catch (error) {
      console.error("Error al cargar feed:", error);

    } finally {
      setLoading(false);

    }

  };

  loadFeed();

  // LIMPIAR CUANDO EL COMPONENTE SE DESMONTA
  return () => {

    setFeed([]);
    setLoading(true);
    setHasInterests(true);

  };

}, [user]);


  /* =========================
      LOADING
  ========================== */
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  /* =========================
      SIN INTERESES / SIN FEED
  ========================== */
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

  /* =========================
      FEED TIPO THREADS
  ========================== */
  return (
    <div className="flex justify-center px-4 py-6">
      <div className="w-full max-w-xl flex flex-col gap-6">

        {/* Selector Para ti / Seguidos */}
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

        {/* Publicaciones */}
        {feed.map((item) => (
          <PostCard key={item.id_publicacion} post={item} />
        ))}

      </div>
    </div>
  );
}

export default Feed;
