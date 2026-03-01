import axios from "axios";
import db from "../../db.js"; 
import 'dotenv/config';

export async function getFeed(req, res) {
  const email = req.query.email || req.body.email;

  if (!email) {
    return res.status(400).json({ error: "Email es requerido" });
  }

  try {
      const [rows] = await db.query(`
        SELECT s.nombre_subcategoria
        FROM preferencias_test pt
        JOIN subcategorias s ON pt.id_subcategoria = s.id_subcategoria
        WHERE pt.email = ?
      `, [email]);


    if (rows.length === 0) {
      return res.status(400).json({ error: "Usuario sin preferencias" });
    }

    const mapToNewsAPI = {
      "Libros y novelas": "entertainment",
      "Cine y películas": "entertainment",
      "Series y TV": "entertainment",
      "Música y conciertos": "entertainment",
      "Videojuegos": "technology",
      "Moda y estilo": "entertainment"
    };

    const categoriesArray = rows
      .map(row => mapToNewsAPI[row.nombre_subcategoria.toLowerCase()])
      .filter(Boolean);
    if (categoriesArray.length === 0) {
  categoriesArray.push("entertainment");
     } //por defecto

    const uniqueCategories = [...new Set(categoriesArray)];

    const promises = uniqueCategories.map(category =>
      axios.get("https://newsapi.org/v2/top-headlines", {
        params: {
          category,
          language: "es",
          pageSize: 5,
          apiKey: process.env.NEWS_API_KEY
        }
      })
    );

    const results = await Promise.all(promises);

    const articles = results
      .flatMap(r => r.data.articles)
      .filter(article => article.urlToImage);

    res.json({ results: articles });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo feed" });
  }
}
