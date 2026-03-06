import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) {
    console.error(" VITE_API_URL no está definida");
    }

// Funciones auxiliares
const isYouTube = (url) => url.includes("youtube.com") || url.includes("youtu.be");


    const getYouTubeEmbed = (url) => {
    const videoId = url.includes("youtu.be") ? url.split("/").pop() : url.split("v=")[1];
    return `https://www.youtube.com/embed/${videoId}`;
    };

    export default function CreatePost({ isOpen, onClose, onPublicacionCreada }) {
    // Estados

    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageTitle, setMessageTitle] = useState("");
    const [messageText, setMessageText] = useState("");

    const [description, setDescription] = useState("");
    const [mediaUrl, setMediaUrl] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [publicando, setPublicando] = useState(false);
    
    const { user } = useAuth();

    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState("");
    const [interesesUsuario, setInteresesUsuario] = useState([]);

    // Cargar categorías al iniciar
    useEffect(() => {
        if (!API_URL) return;
        
        fetch(`${API_URL}/api/categorias`)
        .then((res) => res.json())
        .then((data) => setCategorias(data))
        .catch((err) => console.error(err));
        if (user?.email) {
            fetch(`${API_URL}/api/usuarios/perfil-completo/${user.email}?visitor=${user.email}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.preferencias) {
                    setInteresesUsuario(data.preferencias);
                }
            })
            .catch((err) => console.error("Error cargando intereses:", err));
}
    }, [user]);


    // Limpiar estados al cerrar modal
useEffect(() => {
    if (!isOpen) {
        if (preview && file) URL.revokeObjectURL(preview);
        setPreview(null);
        setFile(null);
        setMediaUrl("");
        setCategoriaSeleccionada("");
        setSubcategoriaSeleccionada("");
        setDescription("");
    }
}, [isOpen]);

    // Cambiar categoría y cargar subcategorías
    const handleCategoriaChange = (e) => {
        const id = e.target.value;
        setCategoriaSeleccionada(id);
        setSubcategoriaSeleccionada("");
        if (!id) {
        setSubcategorias([]);
        return;
        }
        fetch(`${API_URL}/api/categorias/${id}/subcategorias`)
        .then((res) => res.json())
        .then((data) => setSubcategorias(data))
        .catch((err) => console.error(err));
    };

    // Seleccionar archivo desde PC
    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;
        setFile(selected);
        setMediaUrl("");
        setPreview(URL.createObjectURL(selected));
    };

    // Quitar media
    const handleRemoveMedia = () => {
        setFile(null);
        setMediaUrl("");
        setPreview(null);
    };

    // Publicar
    const handlePublish = async () => {
        if (publicando) return;
        setPublicando(true);

        if (!categoriaSeleccionada || !subcategoriaSeleccionada) {
        setMessageTitle("Selecciona categoría");
        setMessageText("Debes seleccionar una categoría y subcategoría antes de publicar.");
        setShowMessageModal(true);
        setPublicando(false);
        return;
        }
        if (!description.trim()) {
        setMessageTitle("Añade una descripción");
        setMessageText("Escribe algo para que tu publicación tenga contenido.");
        setShowMessageModal(true);
        setPublicando(false);
        return;
        }

        let tipo = "articulo";
        let url_media = null;
        let enlace_externo = null;

        if (mediaUrl && isYouTube(mediaUrl)) {
        tipo = "video";
        enlace_externo = mediaUrl;
        } else if (file) {
        tipo = file.type.startsWith("video") ? "video" : "imagen";
        } else if (mediaUrl) {
        tipo = "imagen";
        url_media = mediaUrl;
        }

        if (!user?.email) {
        setMessageTitle("Debes iniciar sesión");
        setMessageText("Necesitas estar autenticada para publicar contenido.");
        setShowMessageModal(true);
        setPublicando(false);
        return;
        }

        const formData = new FormData();
        formData.append("email_autor", user.email);
        formData.append("id_categoria", categoriaSeleccionada);
        formData.append("id_subcategoria", subcategoriaSeleccionada);
        formData.append("titulo", "Nueva publicación");
        formData.append("descripcion", description);
        formData.append("tipo", tipo);
        if (url_media) formData.append("url_media", url_media);
        if (enlace_externo) formData.append("enlace_externo", enlace_externo);
        if (file) formData.append("archivo", file);

try {
        const response = await fetch(`${API_URL}/api/publicaciones`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            setMessageTitle("Publicación creada");
            setMessageText("Tu publicación se creó correctamente y ya está visible.");
            setShowMessageModal(true);

            // Limpiar formulario
            setDescription("");
            setFile(null);
            setPreview(null);
            setMediaUrl("");
            setCategoriaSeleccionada("");
            setSubcategoriaSeleccionada("");

            if (typeof onPublicacionCreada === "function") {
                onPublicacionCreada(data);
            }

            setTimeout(() => {
                setShowMessageModal(false);
                onClose();
            }, 1500);

        } else {
            console.error("Error backend:", data);
            setMessageTitle("Error al publicar");
            setMessageText("Error al publicar: " + (data.message || "Error desconocido"));
            setShowMessageModal(true);
        }

    } catch (error) {
        console.error("Error de fetch:", error);
        setMessageTitle("Error al publicar");
        setMessageText("Ocurrió un problema. Intenta nuevamente.");
        setShowMessageModal(true);

    } finally {
        setPublicando(false);
    }
};

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md rounded-3xl p-6 relative shadow-xl">
            {/* Cerrar */}
            <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
            <X />
            </button>

            <h2 className="text-xl font-bold text-center mb-4">Crear nueva publicación</h2>

            {/* Descripción */}
            <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Añade una descripción..."
            className="w-full border rounded-xl p-3 resize-none focus:outline-none focus:ring"
            rows={3}
            />

            {/* Categorías */}
            <select
            value={categoriaSeleccionada}
            onChange={handleCategoriaChange}
            className="w-full mt-3 border rounded-xl p-2"
            >
            <option value="">Selecciona una categoría</option>
            {categorias
            .filter(cat =>
                interesesUsuario.some(pref => pref.nombre_categoria === cat.nombre)
            )
            .map((cat) => (
            <option key={cat.id} value={cat.id}>
            {cat.nombre}
            </option>
            ))}
            </select>

            {/* Subcategorías */}
            {subcategorias.length > 0 && (
            <select
                value={subcategoriaSeleccionada}
                onChange={(e) => setSubcategoriaSeleccionada(e.target.value)}
                className="w-full mt-3 border rounded-xl p-2"
            >
                <option value="">Selecciona una subcategoría</option>
                {subcategorias
                .filter(sub =>
                        interesesUsuario.some(pref =>
                        pref.hashtag_subcategoria
                        .replace("#","")
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g,"")
                        === 
                        sub.nombre
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g,"")
                    )
                )
                .map((sub) => (
                <option key={sub.id} value={sub.id}>
                {sub.nombre}
                </option>
                ))}
            </select>
            )}

            {/* Media */}
            <div className="mt-4 space-y-3">
            <input
                type="text"
                placeholder="Pega una URL de imagen o video (YouTube, etc.)"
                value={mediaUrl}
                disabled={file !== null}
                onChange={(e) => {
                setMediaUrl(e.target.value);
                setFile(null);
                setPreview(e.target.value);
                }}
                className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring disabled:bg-gray-100"
            />

            <label className="block text-sm text-blue-600 font-medium cursor-pointer">
            Subir desde mi computadora
                <input type="file" accept="image/*,video/*" hidden onChange={handleFileChange} />
            </label>

            {/* Vista previa */}
            {preview && (
                <div className="rounded-xl overflow-hidden bg-gray-100 flex justify-center relative">
                <button
                    onClick={handleRemoveMedia}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                >
                    X
                </button>
                {mediaUrl && isYouTube(mediaUrl) ? (
                    <iframe
                    className="w-full h-40"
                    src={getYouTubeEmbed(mediaUrl)}
                    title="YouTube preview"
                    allowFullScreen
                    />
                ) : file && file.type.startsWith("video") ? (
                    <video src={preview} controls className="max-h-40 rounded-lg" />
                ) : (
                    <img src={preview} alt="Preview" className="max-h-40 object-contain" />
                )}
                </div>
            )}
            </div>

            {/* Botón publicar */}
            <button
            onClick={handlePublish}
            disabled={publicando}
            className={`mt-6 w-full py-2 rounded-xl font-semibold ${
                publicando
                ? "bg-gray-300 text-gray-600"
                : "bg-blue-200 hover:bg-blue-300 text-blue-800"
            }`}
            >
            {publicando ? "Publicando..." : "Publicar"}
            </button>
        </div>

        {showMessageModal && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
        
        <div className="bg-white rounded-2xl p-8 w-[430px] shadow-2xl relative">

            {/* LOGO */}
            <div className="absolute top-6 left-6">
                <img
                    src="/logo.png"
                    alt="FeedYou"
                    className="h-8 object-contain"
                />
            </div>

            {/* CONTENIDO */}
            <div className="text-center mt-6">

                <h3 className="text-xl font-semibold text-gray-800 mb-4 tracking-tight">
                    {messageTitle}
                </h3>

                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    {messageText}
                </p>

                <div className="flex justify-center gap-4">

                    <button
                        onClick={() => setShowMessageModal(false)}
                        className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition shadow-md"
                    >
                        Aceptar
                    </button>

                </div>

            </div>
        </div>
    </div>
)}
        </div>
    );
}

