// controlador para las publicaciones de api newsapi

import db from "../../db.js";

const NEWS_API_KEY = process.env.NEWS_API_KEY;

// MAPEO DE CATEGORÍAS
const categoriaMap = {
  entertainment: 7, // Cine
  sports: 6,        // Deporte
  health: 6,        // Fitness
  technology: 4,    // Arte digital / Tecnología
  science: 4,       // Arte / Fotografía
  general: 9,       // Literatura / Noticias
  business: 8       // Turismo / Lifestyle
};

// DETECTOR INTELIGENTE DE SUBCATEGORÍAS
function detectarSubcategoria(texto, id_categoria) {

    if (!texto) return null;
    const t = texto.toLowerCase();

    // CINE
    if (id_categoria === 7) {

        if (t.includes("terror")) return 35;
        if (t.includes("acción") || t.includes("accion")) return 36;
        if (t.includes("drama")) return 37;
        if (t.includes("ciencia ficción") || t.includes("sci-fi")) return 38;
        if (t.includes("animación") || t.includes("animacion")) return 39;

        return 23; // Películas default
    }

    // DEPORTE
    if (id_categoria === 6) {

        if (t.includes("fútbol") || t.includes("futbol")) return 20;
        if (t.includes("fitness")) return 21;
        if (t.includes("entrenamiento")) return 22;
        if (t.includes("baloncesto")) return 40;
        if (t.includes("tenis")) return 41;

        return 20;
    }

    // MUSICA
    if (id_categoria === 5) {

        if (t.includes("rock")) return 43;
        if (t.includes("pop")) return 44;
        if (t.includes("reggaeton")) return 45;

        return 16;
    }

    // ARTE / TECNOLOGÍA
    if (id_categoria === 4) {

        if (t.includes("inteligencia artificial") || t.includes("ia")) return 47;
        if (t.includes("tecnología") || t.includes("tecnologia")) return 46;

        return 14;
    }

    // LITERATURA / NOTICIAS
    if (id_categoria === 9) {

        if (t.includes("libro")) return 31;
        if (t.includes("cultura")) return 49;
        if (t.includes("noticia")) return 48;

        return 48;
    }

    // TURISMO
    if (id_categoria === 8) {

        if (t.includes("playa")) return 27;
        if (t.includes("ciudad")) return 28;
        if (t.includes("aventura")) return 29;

        return 28;
    }

    return null;
    }

    export const obtenerNoticiasPorCategoria = async (req, res) => {
    try {
        const { categoria } = req.params;
        const id_categoria = categoriaMap[categoria];

        if (!id_categoria) {

            return res.status(400).json({
                message: "Categoría no válida"
            });

        }

        const queryMap = {
        entertainment: "cine OR pelicula OR serie OR estreno",
        sports: "deporte OR futbol OR tenis OR baloncesto",
        technology: "tecnologia OR inteligencia artificial OR software",
        health: "fitness OR salud OR entrenamiento",
        science: "ciencia OR investigacion",
        business: "viajes OR turismo OR negocios",
        general: "noticias OR cultura"
        };

        const query = queryMap[categoria] || categoria;
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=es&pageSize=100&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;


        const response = await fetch(url);
        const data = await response.json();

        console.log("Noticias recibidas:", data.articles?.length);
        console.log(data.articles);

        for (const articulo of data.articles) {

        const titulo = articulo.title || "";
        const descripcion = articulo.description || "";
        const textoCompleto = titulo + " " + descripcion;

        const id_subcategoria = detectarSubcategoria(
            textoCompleto,
            id_categoria
        );

        const url_media = articulo.urlToImage || null;
        const enlace_externo = articulo.url || null;
        const fuente = articulo.source?.name || "NewsAPI";

        // evitar duplicados
        let existe = [];

        if (enlace_externo) {
        const [rows] = await db.query(
            "SELECT id_publicacion FROM publicaciones WHERE enlace_externo = ?",
            [enlace_externo]
        );
        existe = rows;
        }

        if (existe.length === 0) {
            console.log("Insertando noticia:", titulo);

            await db.query(`
            INSERT INTO publicaciones
            (
                email_autor,
                id_categoria,
                id_subcategoria,
                titulo,
                descripcion,
                tipo,
                url_media,
                enlace_externo,
                fuente,
                es_noticia,
                estado
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
            "newsapi@feedyou.com",
            id_categoria,
            id_subcategoria,
            titulo,
            descripcion,
            "articulo",
            url_media,
            enlace_externo,
            fuente,
            1,
            "aprobado"
            ]);

        }

        }

        res.json({
        message: "Noticias guardadas con subcategoría automática"
        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
        message: "Error NewsAPI"
        });

    }

};

// para cargar mas de una categoria de la api (newsapi)

export const cargarTodasLasCategorias = async (req, res) => {

    try {

        const categoriasNewsAPI = [
            "entertainment",
            "sports",
            "health",
            "technology",
            "science",
            "general",
            "business"
        ];

        let totalInsertadas = 0;

        for (const categoria of categoriasNewsAPI) {

            console.log("Cargando categoría:", categoria);
            const id_categoria = categoriaMap[categoria];

            if (!id_categoria) continue;

            const url = `https://newsapi.org/v2/top-headlines?category=${categoria}&language=es&pageSize=50&apiKey=${NEWS_API_KEY}`;

            const response = await fetch(url);
            const data = await response.json();

            if (!data.articles) continue;

            for (const articulo of data.articles) {

                const titulo = articulo.title || "";
                const descripcion = articulo.description || "";
                const textoCompleto = titulo + " " + descripcion;

                const id_subcategoria = detectarSubcategoria(
                    textoCompleto,
                    id_categoria
                );

                const url_media = articulo.urlToImage || null;
                const enlace_externo = articulo.url || null;
                const fuente = articulo.source?.name || "NewsAPI";

                // evitar duplicados
                let existe = [];

                if (enlace_externo) {

                    const [rows] = await db.query(
                        "SELECT id_publicacion FROM publicaciones WHERE enlace_externo = ?",
                        [enlace_externo]
                    );

                    existe = rows;

                }

                if (existe.length === 0) {

                    await db.query(`
                        INSERT INTO publicaciones
                        (
                            email_autor,
                            id_categoria,
                            id_subcategoria,
                            titulo,
                            descripcion,
                            tipo,
                            url_media,
                            enlace_externo,
                            fuente,
                            es_noticia,
                            estado
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `, [
                        "newsapi@feedyou.com",
                        id_categoria,
                        id_subcategoria,
                        titulo,
                        descripcion,
                        "articulo",
                        url_media,
                        enlace_externo,
                        fuente,
                        1,
                        "aprobado"
                    ]);

                    totalInsertadas++;

                }

            }

        }

        res.json({
            message: "Carga completa finalizada",
            totalInsertadas
        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error al cargar todas las categorias"
        });

    }

};

// cargar las publicaciones por keyword para que me llena la bd en las otras categorias

export const cargarNoticiasPorKeywords = async (req, res) => {

    try {

        const categoriasKeywords = [
            { keyword: "futbol", id_categoria: 6 },
            { keyword: "tecnologia", id_categoria: 4 },
            { keyword: "musica", id_categoria: 5 },
            { keyword: "arte", id_categoria: 4 },
            { keyword: "viajes", id_categoria: 8 },
            { keyword: "libros", id_categoria: 9 },
            { keyword: "fitness", id_categoria: 6 },
            { keyword: "cine", id_categoria: 7 }
        ];

        let totalInsertadas = 0;

        for (const cat of categoriasKeywords) {

            console.log("Buscando:", cat.keyword);

            const url = `https://newsapi.org/v2/everything?q=${cat.keyword}&language=es&pageSize=20&apiKey=${NEWS_API_KEY}`;

            const response = await fetch(url);
            const data = await response.json();

            for (const articulo of data.articles) {

                const titulo = articulo.title || "";
                const descripcion = articulo.description || "";

                const textoCompleto = titulo + " " + descripcion;

                const id_subcategoria = detectarSubcategoria(
                    textoCompleto,
                    cat.id_categoria
                );

                const enlace_externo = articulo.url;

                const [existe] = await db.query(
                    "SELECT id_publicacion FROM publicaciones WHERE enlace_externo = ?",
                    [enlace_externo]
                );

                if (existe.length === 0) {

                    await db.query(`
                        INSERT INTO publicaciones
                        (
                            email_autor,
                            id_categoria,
                            id_subcategoria,
                            titulo,
                            descripcion,
                            tipo,
                            url_media,
                            enlace_externo,
                            fuente,
                            es_noticia,
                            estado
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `, [
                        "newsapi@feedyou.com",
                        cat.id_categoria,
                        id_subcategoria,
                        titulo,
                        descripcion,
                        "articulo",
                        articulo.urlToImage,
                        articulo.url,
                        articulo.source?.name,
                        1,
                        "aprobado"
                    ]);

                    totalInsertadas++;
                }

            }

        }

        res.json({
            message: "Noticias cargadas por keywords",
            totalInsertadas
        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error cargando keywords"
        });

    }

};

// traer mas publicaciones para las subcategorias de cine
export const cargarCinePorGeneros = async (req, res) => {

    try {

        const generos = [
            { keyword: "pelicula de accion", subcategoria: 36 },
            { keyword: "pelicula de terror", subcategoria: 35 },
            { keyword: "pelicula animada", subcategoria: 39 },
            { keyword: "pelicula drama", subcategoria: 37 },
            { keyword: "serie de accion", subcategoria: 36 },
            { keyword: "serie de terror", subcategoria: 35 }
        ];

        let totalInsertadas = 0;

        for (const genero of generos) {

            console.log("Buscando:", genero.keyword);

            const url =
            `https://newsapi.org/v2/everything?q=${encodeURIComponent(genero.keyword)}&language=es&pageSize=70&apiKey=${NEWS_API_KEY}`;

            const response = await fetch(url);
            const data = await response.json();

            for (const articulo of data.articles || []) {

                const titulo = articulo.title || "";
                const descripcion = articulo.description || "";

                const enlace_externo = articulo.url || null;

                if (!enlace_externo) continue;

                const [existe] = await db.query(
                    "SELECT id_publicacion FROM publicaciones WHERE enlace_externo = ?",
                    [enlace_externo]
                );

                if (existe.length > 0) continue;

                await db.query(`
                    INSERT INTO publicaciones
                    (
                        email_autor,
                        id_categoria,
                        id_subcategoria,
                        titulo,
                        descripcion,
                        tipo,
                        url_media,
                        enlace_externo,
                        fuente,
                        es_noticia,
                        estado
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    "newsapi@feedyou.com",
                    7,
                    genero.subcategoria,
                    titulo,
                    descripcion,
                    "articulo",
                    articulo.urlToImage || null,
                    enlace_externo,
                    articulo.source?.name || "NewsAPI",
                    1,
                    "aprobado"
                ]);

                totalInsertadas++;

            }

        }

        res.json({
            message: "Cine por géneros cargado",
            totalInsertadas
        });

    }
    catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error cargando géneros"
        });

    }

};


