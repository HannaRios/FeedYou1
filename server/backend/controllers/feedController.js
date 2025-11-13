import axios from "axios";

export async function getFeed(req, res) {
  const tagsQuery = req.query.tags || "inspiration,art,creative"; 
  const tagsArray = tagsQuery.split(",").map(tag => tag.trim());

  console.log("🔍 Buscando imágenes con tags:", tagsArray);
  console.log("🔑 API Key presente:", !!process.env.UNSPLASH_KEY);

  try {
    const promises = tagsArray.map(tag =>
      axios.get("https://api.unsplash.com/photos/random", {
        params: { query: tag, count: 5 },
        headers: { Authorization: `Client-ID ${process.env.UNSPLASH_KEY}` },
      })
    );

    const results = await Promise.all(promises);

    const images = results.flatMap(r => Array.isArray(r.data) ? r.data : [r.data]);

    const formattedImages = images.map(img => ({
      id: img.id,
      description: img.description || img.alt_description,
      url: img.urls.small,
      full: img.urls.full,
      user: img.user.name,
    }));

    console.log(`✅ ${formattedImages.length} imágenes obtenidas correctamente`);
    res.json({ results: formattedImages });
  } catch (err) {
    console.error("❌ Error fetching Unsplash feed:", err.message);
    if (err.response) {
      console.error("Detalles del error:", err.response.data);
      return res.status(err.response.status).json({ 
        error: "Error al obtener imágenes de Unsplash",
        details: err.response.data 
      });
    }
    res.status(500).json({ error: "Error interno del servidor", results: [] });
  }
}