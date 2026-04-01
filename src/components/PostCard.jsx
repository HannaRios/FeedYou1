import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import socket from "../socket";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, MessageCircle, Link, Trash2, BadgeCheck, Flag } from "lucide-react";
import FollowButton from "./FollowButton";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL;

export default function PostCard({ post }) {

    const navigate = useNavigate();
    const { user } = useAuth();
    const userEmail = user?.email;

    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    const [liked, setLiked] = useState(post.user_liked === 1);
    const [favorite, setFavorite] = useState(post.user_favorited === 1);

    const [likesCount, setLikesCount] = useState(post.total_likes || 0);
    const [favoritesCount, setFavoritesCount] = useState(post.total_favoritos || 0);
    const [commentsCount, setCommentsCount] = useState(post.total_comentarios || 0);
    const [sharesCount, setSharesCount] = useState(post.total_compartidos || 0);

    const [showShareModal, setShowShareModal] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = `${window.location.origin}/post/${post.id_publicacion}`;
    const [showAuthModal, setShowAuthModal] = useState(false);

useEffect(() => {

    const handleUpdate = (data) => {

        if (Number(data.id_publicacion) !== Number(post.id_publicacion)) return;
        if (data.email === userEmail) return;

        if (data.tipo_interaccion === "me_gusta") {
        if (data.action === "add") {
            setLikesCount(prev => prev + 1);
        }
        if (data.action === "remove") {
            setLikesCount(prev => Math.max(prev - 1, 0));
        }
        }

        if (data.tipo_interaccion === "favorito") {
        if (data.action === "add") {
            setFavoritesCount(prev => prev + 1);
        }
        if (data.action === "remove") {
            setFavoritesCount(prev => Math.max(prev - 1, 0));
        }
        }

        if (data.tipo_interaccion === "comentario") {
        if (data.action === "add") {
            setCommentsCount(prev => prev + 1);
        }
        if (data.action === "remove") {
            setCommentsCount(prev => Math.max(prev - 1, 0));
        }
        }

        if (data.tipo_interaccion === "compartir") {
        if (data.action === "add") {
            setSharesCount(prev => prev + 1);
        }
        }

    };

    // ✅ Registramos listener
    socket.on("post_updated", handleUpdate);

    // ✅ Limpiamos SOLO este listener
    return () => {
        socket.off("post_updated", handleUpdate);
    };

}, [post.id_publicacion, userEmail]);


    console.log("POST:", post);
    const username = post.username_autor || post.username || post.email_autor?.split("@")[0];
    const nombre = post.nombre_autor || post.nombre || "";

    const handleProfileClick = () => {
        if (!post.email_autor) return;
        if (post.email_autor === userEmail) {
            navigate("/profile");
        } else {
            navigate(`/usuario/${post.email_autor}`);
        }
    };

    // ============================
    // LÓGICA DE REPORTE (NUEVO)
    // ============================
    const handleReportar = () => {
        if (!userEmail) {
            setShowAuthModal(true);
            return;
        }

        Swal.fire({
            title: 'Reportar publicación',
            text: "¿Por qué quieres reportar este contenido?",
            icon: 'warning',
            input: 'select',
            inputOptions: {
                'Contenido Inapropiado': 'Contenido Inapropiado',
                'Spam': 'Spam',
                'Acoso': 'Acoso',
                'Odio': 'Lenguaje de odio',
                'Información Falsa': 'Información Falsa'
            },
            inputPlaceholder: 'Selecciona un motivo',
            showCancelButton: true,
            confirmButtonColor: '#ef4444', 
            confirmButtonText: 'Enviar Reporte',
            cancelButtonText: 'Cancelar',
            customClass: { popup: 'rounded-2xl' }
        }).then(async (result) => {
            if (result.isConfirmed && result.value) {
                try {
                    const res = await fetch(`${API_URL}/api/usuarios/denunciar-publicacion`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email_emisor: userEmail,
                            email_acusado: post.email_autor,
                            id_publicacion: post.id_publicacion,
                            motivo: result.value,
                            comentario_adicional: "Reportado desde el feed principal"
                        })
                    });

                    if (res.ok) {
                        Swal.fire({
                            title: 'Reporte Enviado',
                            text: 'Gracias por ayudarnos a mantener la comunidad segura.',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    }
                } catch (error) {
                    console.error("Error al reportar:", error);
                    Swal.fire('Error', 'No se pudo procesar el reporte en este momento.', 'error');
                }
            }
        });
    };


    // ✅ FUNCIÓN PRIMERO
    const getYoutubeEmbedUrl = (url) => {
        if (!url) return null;

        const cleanUrl = url.trim();

        const match = cleanUrl.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
        );

        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }

        return null;
    };

    // ✅ DESPUÉS LA USAMOS
    const youtubeEmbed =
    getYoutubeEmbedUrl(post.enlace_externo) ||
    getYoutubeEmbedUrl(post.descripcion);

    // Definir src correcto (imagenes o videos mp4)
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

      // ============================
    // FETCH COMMENTS
    // ============================

    const fetchComments = async () => {
        try {
            const res = await fetch(
                `${API_URL}/api/interacciones/${post.id_publicacion}/comentarios`
            );
            const data = await res.json();
            setComments(data);
        } catch (error) {
            console.error("Error cargando comentarios:", error);
        }
    };

    const toggleComments = () => {
        const newState = !showComments;
        setShowComments(newState);

        if (newState) {
            fetchComments();
        }
    };

    // ============================
    // ENVIAR COMENTARIO
    // ============================

    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) return;

        if (!userEmail) {
            setShowAuthModal(true);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/interacciones`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: userEmail,
                    id_publicacion: post.id_publicacion,
                    tipo_interaccion: "comentario",
                    comentario: newComment
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Error servidor:", errorData);
                return;
            }

            setNewComment("");
            fetchComments();
            setCommentsCount(prev => prev + 1);

        } catch (error) {
            console.error("Error enviando comentario:", error);
        }
    };

    // ============================
// LIKE
// ============================

const handleLike = async () => {

        if (!userEmail) {
            setShowAuthModal(true);
            return;
        }

    try {

        if (liked) {

        await fetch(`${API_URL}/api/interacciones`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            email: userEmail,
            id_publicacion: post.id_publicacion,
            tipo_interaccion: "me_gusta"
            })
        });

        setLiked(false);
        setLikesCount(prev => Math.max(prev - 1, 0));

        } else {

        await fetch(`${API_URL}/api/interacciones`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            email: userEmail,
            id_publicacion: post.id_publicacion,
            tipo_interaccion: "me_gusta",
            comentario: null
            })
        });

        setLiked(true);
        setLikesCount(prev => prev + 1);

        }

    } catch (error) {
        console.error("Error like toggle:", error);
    }
};


// ============================
// FAVORITO
// ============================

const handleFavorite = async () => {

        if (!userEmail) {
            setShowAuthModal(true);
            return;
        }

    try {

        if (favorite) {

        await fetch(`${API_URL}/api/interacciones`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            email: userEmail,
            id_publicacion: post.id_publicacion,
            tipo_interaccion: "favorito"
            })
        });

        setFavorite(false);
        setFavoritesCount(prev => Math.max(prev - 1, 0));

        } else {

        await fetch(`${API_URL}/api/interacciones`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            email: userEmail,
            id_publicacion: post.id_publicacion,
            tipo_interaccion: "favorito",
            comentario: null
            })
        });

        setFavorite(true);
        setFavoritesCount(prev => prev + 1);

        }

    } catch (error) {
        console.error("Error favorito toggle:", error);
    }
};

const handleDeleteComment = async (id) => {
    try {
        await fetch(`${API_URL}/api/interacciones/${id}`, {
        method: "DELETE",
        });

        setComments(prev =>
        prev.filter(comment => comment.id_interaccion !== id)
        );
        setCommentsCount(prev => Math.max(prev - 1, 0));

    } catch (error) {
        console.error("Error eliminando comentario:", error);
    }
};

const handleShare = async () => {

    if (!userEmail) {
        setShowAuthModal(true);
        return;
    }

    try {

        //  SIEMPRE abrir tu modal
        setShowShareModal(true);

        // Registrar interacción
        const res = await fetch(`${API_URL}/api/interacciones`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: userEmail,
                id_publicacion: post.id_publicacion,
                tipo_interaccion: "compartir",
                comentario: null
            })
        });

        if (res.ok) {
            setSharesCount(prev => prev + 1);
        }

    } catch (error) {
        console.error("Error compartiendo:", error);
    }
};

const copyToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    } catch (error) {
        console.error("Error copiando enlace:", error);
    }
};

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden w-full max-w-3xl mx-auto">

            {/* HEADER */}
            <div className="flex items-center justify-between px-4 pt-4">

            <div className="flex items-center gap-3">
                <img
                onClick={handleProfileClick}
                src={
                    post.foto_perfil
                    ? post.foto_perfil.startsWith("http")
                        ? post.foto_perfil
                        : `${API_URL}${post.foto_perfil}`
                    : `${API_URL}/uploads/perfiles/default.png`
                }
                alt="Foto de perfil"
                className="w-10 h-10 rounded-full object-cover border cursor-pointer hover:opacity-80 transition"
                />
                
                <div className="flex flex-col">

                {/* LINEA USERNAME + CHECK + SEGUIR */}
                <div className="flex items-center gap-1 text-sm">

                    <span 
                        onClick={handleProfileClick}
                        className="font-semibold text-gray-900 cursor-pointer hover:underline"
                    >
                    {username}
                    </span>

                    {post.verificado === 1 && (
                    <BadgeCheck size={14} className="text-blue-500 fill-blue-500" />
                    )}

                    {userEmail &&
                    userEmail !== post.email_autor && (
                        <>
                        <span className="text-gray-400 mx-1">  </span>
                        <FollowButton
                            currentUser={userEmail}
                            targetUser={post.email_autor}
                        />
                        </>
                    )
                }
                </div>
                {/* NOMBRE REAL */}
                <span className="text-xs text-gray-500">
                    {post.nombre_autor}
                </span>
                </div>
            </div>
            
                {/* Botón Reportar (NUEVO) */}
        <button 
            onClick={handleReportar}
            className="p-2 hover:bg-rose-50 rounded-full transition-colors group"
            title="Reportar publicación"
        >
            <Flag size={18} className="text-gray-400 group-hover:text-rose-500 transition-colors" />
        </button>

    </div>

        {/* DESCRIPCIÓN */}
        {post.descripcion && (
            <p className="px-4 text-gray-900 text-[16px] mb-4 mt-2 leading-relaxed">
            {post.descripcion}
            </p>
        )}

        {/* IMAGEN */}
        {mediaSrc && post.tipo !== "video" && (
            <img
            src={mediaSrc}
            alt="Contenido"
            className="w-full max-h-[500px] object-cover mt-2"
            onError={(e) => {
                e.target.style.display = "none";
            }}
            />
        )}

        {/* YOUTUBE */}
        {youtubeEmbed && (
            <div className="w-full mt-3 aspect-video">
            <iframe
                className="w-full h-full rounded-lg"
                src={youtubeEmbed}
                title="YouTube video"
                allowFullScreen
            ></iframe>
            </div>
        )}

        {/* VIDEO MP4 NORMAL */}
        {post.tipo === "video" && mediaSrc && !youtubeEmbed && (
            <video controls className="w-full mt-3">
            <source src={mediaSrc} />
            </video>
        )}

    {/*INTERACCIONES*/}
    <div className="flex justify-between items-center px-4 py-3 border-t mt-2">

        <div className="flex items-center gap-6">

            <button
            onClick={handleLike}
            className="flex items-center gap-1 text-sm"
            >
            <Heart
                size={22}
                strokeWidth={1.8}
                className={`transition ${
                liked
                    ? "fill-red-500 text-red-500"
                    : "text-gray-500"
                }`}
            />
            <span className="text-gray-600">
                {likesCount}
            </span>
            </button>

            <button onClick={toggleComments} className="flex items-center gap-1 text-sm">
            <MessageCircle
                size={22}
                strokeWidth={1.8}
                className={`transition ${
                showComments
                    ? "text-blue-500"
                    : "text-gray-500"
                }`}
            />
            <span className="text-gray-600">
                {commentsCount > 0 ? commentsCount : 0}
            </span>
            </button>

            <button onClick={handleShare} className="flex items-center gap-1 text-sm">
                <Link size={22} strokeWidth={1.8} className="text-gray-500" />
            <span className="text-gray-600">
                {sharesCount > 0 ? sharesCount : 0}
            </span>
            </button>
        </div>

        <button
        onClick={handleFavorite}
        className="flex items-center gap-1 text-sm"
        >
        <Star
            size={22}
            strokeWidth={1.8}
            className={`transition ${
            favorite
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-500"
            }`}
        />
        <span className="text-gray-600">
            {favoritesCount}
        </span>
        </button>
        </div>


{/* ========================= MODAL COMENTARIOS ========================= */}
{showComments && (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-2 sm:p-0">

        <div className="bg-white w-full sm:w-[95%] md:w-full max-w-4xl max-h-[85vh] sm:h-[80vh] md:h-[75vh] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative">

        {/* HEADER MÓVIL (Aparece solo en móviles) */}
        <div className="flex md:hidden items-center justify-between px-5 py-4 border-b border-gray-100 bg-white z-10 w-full shrink-0">
            <h3 className="font-bold text-gray-800 tracking-tight">Comentarios</h3>
            <button
                onClick={() => setShowComments(false)}
                className="text-gray-400 hover:text-gray-700 p-1 bg-gray-100 rounded-full"
            >
                ✕
            </button>
        </div>

        {/* LOGO DESKTOP */}
        <div className="hidden md:block absolute top-4 left-4 pointer-events-none z-20">
            <img src="/logo.png" alt="FeedYou" className="h-10" />
        </div>

        {/* BOTÓN CERRAR DESKTOP */}
        <button
            onClick={() => setShowComments(false)}
            className="hidden md:block absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl z-20 bg-white rounded-full px-2 shadow-sm"
        >
            ✕
        </button>

        {/* IMAGEN IZQUIERDA */}
        <div className="hidden md:flex w-1/2 bg-gray-50 items-center justify-center p-8 border-r border-gray-100">
            {mediaSrc && (
                <img
                    src={mediaSrc}
                    alt="Contenido"
                    className="max-h-full max-w-full object-contain rounded-xl shadow-sm"
                />
            )}
        </div>

        {/* PANEL DERECHO */}
        <div className="w-full md:w-1/2 flex flex-col bg-white">

            {/* LISTA COMENTARIOS */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-[40vh] md:min-h-0 md:pt-14">

            {comments.length === 0 ? (
            <p className="text-sm text-gray-400">
                No hay comentarios aún.
            </p>
            ) : (
                comments.map((comment, index) => (
                <div
                    key={comment.id_interaccion}
                    className={`flex gap-3 py-3 ${
                    index !== comments.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                >
                    {/* FOTO */}
                    <img
                    src={
                        comment.foto_perfil
                        ? comment.foto_perfil.startsWith("http")
                            ? comment.foto_perfil
                            : `${API_URL}${comment.foto_perfil}`
                        : `${API_URL}/uploads/perfiles/default.png`
                    }
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                    />

                    {/* CONTENIDO */}
                    <div className="flex-1">

                    {/* USERNAME */}
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900 text-sm">
                        {comment.email.split("@")[0]}
                        </span>

                        {comment.email === userEmail && (
                        <button
                            onClick={() => handleDeleteComment(comment.id_interaccion)}
                            className="text-gray-400 hover:text-red-500 transition duration-200 hover:scale-110"
                        >
                            <Trash2 size={16} strokeWidth={1.8} />
                        </button>
                        )}
                    </div>

                    {/* BURBUJA COMENTARIO */}
                    <div className="bg-gray-100 mt-1 px-3 py-2 rounded-xl text-sm text-gray-800 inline-block max-w-[90%]">
                        {comment.comentario}
                    </div>

                    {/* FECHA */}
                    <div className="text-xs text-gray-400 mt-1">
                        {new Date(comment.fecha_interaccion).toLocaleDateString()}
                    </div>

                    </div>
                </div>
                ))
        )}
            
</div>

            {/* INPUT ABAJO */}
            <form
            onSubmit={handleSubmitComment}
            className="border-t border-gray-100 p-4 bg-gray-50 sm:bg-white flex gap-2 shrink-0"
            >
            <input
                type="text"
                placeholder="Escribe un comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
            />
            <button
                type="submit"
                className="bg-blue-600 text-white px-5 rounded-full text-sm font-medium hover:bg-blue-700 transition"
            >
                Enviar
            </button>
            </form>

        </div>
        </div>
    </div>
)}

{showShareModal && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
        
        <div className="bg-white rounded-2xl p-6 md:p-8 w-[90%] md:w-[430px] shadow-2xl relative">

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
                    Compartir publicación
                </h3>

                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    Comparte esta publicación con otras personas.
                    Puedes copiar el enlace directo o enviarlo
                    a través de tus plataformas favoritas.
                </p>

                <div className="relative mb-6">
                    <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-gray-50 focus:outline-none"
                    />

                    {copied && (
                        <span className="absolute right-3 top-3 text-green-600 text-xs font-medium">
                            ✓ Copiado
                        </span>
                    )}
                </div>

                <div className="flex justify-center gap-4">

                    <button
                        onClick={() => setShowShareModal(false)}
                        className="px-5 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={copyToClipboard}
                        className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition shadow-md"
                    >
                        Copiar enlace
                    </button>

                </div>

            </div>
        </div>
    </div>
)}

{showAuthModal && (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 md:p-8 w-[90%] md:w-[420px] shadow-2xl relative">

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
                    Inicia sesión para interactuar
                </h3>

                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    Puedes ver todas las publicaciones sin registrarte,
                    pero necesitas una cuenta para dar like, comentar,
                    guardar o compartir contenido.
                    <br /><br />
                    Además, tu feed se personaliza según las categorías
                    y subcategorías que elijas al registrarte.
                </p>

                <div className="flex justify-center gap-4">

                    <button
                        onClick={() => setShowAuthModal(false)}
                        className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
                    >
                        Seguir viendo
                    </button>

                    <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition shadow-md"
                    >
                        Iniciar sesión
                    </button>

                </div>
            </div>

        </div>
    </div>
)}

    </div>
    );
}