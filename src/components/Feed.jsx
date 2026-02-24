import { useEffect, useState } from "react";
import ChatBot from "./ChatBot";

function Feed() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false); 

  useEffect(() => {
    const getFeed = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) {
          console.error("No hay datos de usuario en localStorage");
          setLoading(false);
          return;
        }

        const user = JSON.parse(userData);

        if (!user || !user.email) {
          console.error("El objeto usuario no tiene email");
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:4000/api/feed?email=${user.email}`);
        
        if (!response.ok) throw new Error(`Error en el servidor: ${response.status}`);

        const data = await response.json();
        console.log("Feed recibido:", data);

        if (data && Array.isArray(data)) setFeed(data);
        else if (data && data.results && Array.isArray(data.results)) setFeed(data.results);
        else setFeed([]);
      } catch (error) {
        console.error("Error al obtener feed:", error);
        setFeed([]);
      } finally {
        setLoading(false);
      }
    };

    getFeed();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {!Array.isArray(feed) || feed.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No hay contenido disponible
            </h3>
            <p className="text-gray-600">
              Verifica que tengas intereses guardados o que el servidor esté activo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feed.map((item, index) => (
              <div key={item.id || index} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                {item.urlToImage && (
                  <img
                    src={item.urlToImage}
                    alt={item.title}
                    className="w-full h-64 object-cover"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=No+Image'; }}
                  />
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{item.description}</p>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 text-sm font-semibold hover:text-purple-800"
                    >
                      Leer más →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón para abrir/ocultar el chat */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 bg-pink-400 hover:bg-pink-500 text-white rounded-full w-14 h-14 flex items-center justify-center z-40 shadow-lg"
      >
        💬
      </button>

      {/* ChatBot solo se monta si chatOpen es true */}
      {chatOpen && <ChatBot onClose={() => setChatOpen(false)} />}
    </div>
  );
}

export default Feed;
