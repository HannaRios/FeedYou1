import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchFeed } from "../services/feedService";
import { mapTestToTags } from "../utils/mapTestToTags";

function Feed({ testAnswers: propTestAnswers }) {
  const location = useLocation();
  
  const testAnswers = propTestAnswers || location.state?.testAnswers || {};

  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tags = mapTestToTags(testAnswers);
    console.log("Tags generados:", tags); 

    fetchFeed(tags)
      .then((data) => {
        console.log("Feed recibido:", data); 
        setFeed(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => setLoading(false));
  }, [testAnswers]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Grid de contenido */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {feed.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No hay contenido disponible
            </h3>
            <p className="text-gray-600">Intenta completar el test nuevamente</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feed.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">
                    {item.title || "Publicación"}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {item.text || "Contenido inspirador"}
                  </p>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;
