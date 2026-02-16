const API_URL = import.meta.env.VITE_API_URL;

export default function PostCard({ post }) {
    console.log("POST:", post);

    //Detectar imagen externa
    const isExternal =
        post.archivo && post.archivo.startsWith("http");

    // Definir src correcto
    const mediaSrc =
        post.url_media
            ? post.url_media.startsWith("http")
                ? post.url_media
                : `${API_URL}${post.url_media}`
            : post.archivo
                ? post.archivo.startsWith("http")
                    ? post.archivo
                    : `${API_URL}${post.archivo}`
                : null;



    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {/* HEADER: foto + usuario */}
        <div className="flex items-center gap-3 px-4 pt-4">
        {/* Foto de perfil */}
            <img
                src={
                    post.foto_perfil
                    ? post.foto_perfil.startsWith("http")
                        ? post.foto_perfil
                        : `${API_URL}${post.foto_perfil}`
                    : "/avatar-default.png"
                }
            alt="Foto de perfil"
            className="w-10 h-10 rounded-full object-cover border"
        />

        {/* Nombre de usuario */}
        <div className="flex flex-col">
            <span className="font-semibold text-gray-900 text-sm mt-2">
            {post.email_autor.split("@")[0]}
            </span>
            <span className="text-xs text-gray-500 mb-3">
            {post.email_autor}
            </span>
        </div>
        </div>

        {/* Descripción */}
        {post.descripcion && (
            <p className="px-4 text-gray-600 text-sm mb-3 mt-1">
            {post.descripcion}
            </p>
        )}


        {/* Imagen */}
        {post.tipo === "imagen" && mediaSrc && (
        <img
            src={mediaSrc}
            className="w-full max-h-[500px] object-cover mt-2"
        />
        )}

        {/* Video */}
        {post.tipo === "video" && mediaSrc && (
            <video controls className="w-full mt-3">
            <source src={mediaSrc} />
            </video>
        )}

        {/* Interacciones */}
        <div className="flex gap-6 px-4 py-3 text-gray-600">
            <button>❤️</button>
            <button>💬</button>
            <button
            onClick={() =>
                navigator.clipboard.writeText(
                `${window.location.origin}/post/${post.id_publicacion}`
                )
            }
            >
            🔗
            </button>
        </div>

        </div>
    );
    }
