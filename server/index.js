import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

function normalizeUnsplash(item, tags) {
  return {
    id: `uns_${item.id}`,
    source: "unsplash",
    type: "image",
    title: item.alt_description || "Imagen",
    text: item.description || "",
    image: item.urls.small,
    mediaUrl: item.links.html,
    tags,
    publishedAt: item.created_at
  };
}

app.get("/api/feed", async (req, res) => {
  const tags = (req.query.tags || "").split(",").filter(Boolean);
  if (!tags.length) return res.json({ results: [] });

  try {
    const query = encodeURIComponent(tags.join(","));
    const unsplashRes = await axios.get(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=10`,
      { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_KEY}` } }
    );

    const results = unsplashRes.data.results.map(item => normalizeUnsplash(item, tags));
    res.json({ results });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error obteniendo datos del feed" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Servidor FeedYou corriendo en puerto ${PORT}`));
