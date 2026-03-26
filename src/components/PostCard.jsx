import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
<<<<<<< HEAD
import { Heart, Star, MessageCircle, Link, Flag } from "lucide-react"; 
=======
>>>>>>> a3bc1d682b2830b98adf1496d1f6c71f86038597
import socket from "../socket";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
=======
import { Heart, Star, MessageCircle, Link, Trash2, BadgeCheck, Flag } from "lucide-react";
import FollowButton from "./FollowButton";
>>>>>>> a3bc1d682b2830b98adf1496d1f6c71f86038597
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

    const [showShareModal, setShowShareModal] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = `${window.location.origin}/post/${post.id_publicacion}`;
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        const handleUpdate = (data) => {
            if (Number(data.id_publicacion) !== Number(post.id_publicacion)) return;
            if (data.email === userEmail) return;

            if (data.tipo_interaccion === "me_gusta") {
                if (data.action === "add") setLikesCount(prev => prev + 1);
                if (data.action === "remove") setLikesCount(prev => Math.max(prev - 1, 0));
            }

            if (data.tipo_interaccion === "favorito") {
                if (data.action === "add") setFavoritesCount(prev => prev + 1);
                if (data.action === "remove") setFavoritesCount(prev => Math.max(prev - 1, 0));
            }
        };

        socket.on("post_updated", handleUpdate);
        return () => {
            socket.off("post_updated", handleUpdate);
        };
    }, [post.id_publicacion, userEmail]);

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

<<<<<<< HEAD
=======
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
>>>>>>> a3bc1d682b2830b98adf1496d1f6c71f86038597
    const getYoutubeEmbedUrl = (url) => {
        if (!url) return null;
        const match = url.trim().match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return match && match[1] ? `https://www.youtube.com/embed/${match[1]}` : null;
    };

    const youtubeEmbed = getYoutubeEmbedUrl(post.enlace_externo) || getYoutubeEmbedUrl(post.descripcion);

    const mediaSrc = post.url_media
        ? post.url_media.startsWith("http") ? post.url_media : `${API_URL}${post.url_media}`
        : post.archivo
            ? post.archivo.startsWith("http") ? post.archivo : `${API_URL}${post.archivo}`
            : null;

    const fetchComments = async () => {
        try {
            const res = await fetch(`${API_URL}/api/interacciones/${post.id_publicacion}/comentarios`);
            const data = await res.json();
            setComments(data);
        } catch (error) {
            console.error("Error cargando comentarios:", error);
        }
    };

    const toggleComments = () => {
        const newState = !showComments;
        setShowComments(newState);
        if (newState) fetchComments();
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        if (!userEmail) { setShowAuthModal(true); return; }

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
            if (res.ok) {
                setNewComment("");
                fetchComments();
            }
        } catch (error) {
            console.error("Error enviando comentario:", error);
        }
    };

    const handleLike = async () => {
        if (!userEmail) { setShowAuthModal(true); return; }
        try {
            const method = liked ? "DELETE" : "POST";
            await fetch(`${API_URL}/api/interacciones`, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: userEmail,
                    id_publicacion: post.id_publicacion,
                    tipo_interaccion: "me_gusta"
                })
            });
            setLiked(!liked);
            setLikesCount(prev => liked ? Math.max(prev - 1, 0) : prev + 1);
        } catch (error) { console.error("Error like:", error); }
    };

    const handleFavorite = async () => {
        if (!userEmail) { setShowAuthModal(true); return; }
        try {
            const method = favorite ? "DELETE" : "POST";
            await fetch(`${API_URL}/api/interacciones`, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: userEmail,
                    id_publicacion: post.id_publicacion,
                    tipo_interaccion: "favorito"
                })
            });
            setFavorite(!favorite);
            setFavoritesCount(prev => favorite ? Math.max(prev - 1, 0) : prev + 1);
        } catch (error) { console.error("Error favorito:", error); }
    };

<<<<<<< HEAD
    const handleShare = async () => {
        if (!userEmail) { setShowAuthModal(true); return; }
=======
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
>>>>>>> a3bc1d682b2830b98adf1496d1f6c71f86038597
        setShowShareModal(true);
        try {
            await fetch(`${API_URL}/api/interacciones`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: userEmail,
                    id_publicacion: post.id_publicacion,
                    tipo_interaccion: "compartir"
                })
            });
        } catch (error) { console.error("Error compartiendo:", error); }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) { console.error("Error copiando:", error); }
    };

    return (
<<<<<<< HEAD
        <div className="bg-white rounded-xl shadow-sm overflow-hidden w-full max-w-3xl mx-auto mb-6 border">
            
            {/* HEADER CON BOTÓN DE REPORTE */}
            <div className="flex items-center justify-between px-4 pt-4">
                <div className="flex items-center gap-3">
                    <img
                        src={post.foto_perfil ? (post.foto_perfil.startsWith("http") ? post.foto_perfil : `${API_URL}${post.foto_perfil}`) : "/avatar-default.png"}
                        alt="Perfil"
                        className="w-10 h-10 rounded-full object-cover border"
=======
        <div className="bg-white rounded-xl shadow-sm overflow-hidden w-full max-w-3xl mx-auto">

            {/* HEADER */}
            <div className="flex items-center justify-between px-4 pt-4">

            <div className="flex items-center gap-3">
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
                
                <div className="flex flex-col">

                {/* LINEA USERNAME + CHECK + SEGUIR */}
                <div className="flex items-center gap-1 text-sm">

                    <span className="font-semibold text-gray-900">
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

            <button onClick={toggleComments}>
            <MessageCircle
                size={22}
                strokeWidth={1.8}
                className={`transition ${
                showComments
                    ? "text-blue-500"
                    : "text-gray-500"
                }`}
            />
            </button>

            <button onClick={handleShare}>
                <Link size={22} strokeWidth={1.8} className="text-gray-500" />
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

        <div className="bg-white w-full max-w-4xl h-[75vh] rounded-2xl shadow-2xl flex overflow-hidden relative">

        {/* LOGO */}
        <div className="absolute top-4 left-4">
            <img src="/logo.png" alt="FeedYou" className="h-10" />
        </div>

        {/* BOTÓN CERRAR */}
        <button
            onClick={() => setShowComments(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
            ✕
        </button>

        {/* IMAGEN IZQUIERDA */}
        <div className="w-1/2 bg-gray-100 flex items-center justify-center p-8">
            {mediaSrc && (
                <img
                    src={mediaSrc}
                    alt="Contenido"
                    className="max-h-full max-w-full object-contain rounded-xl shadow-md"
                />
            )}
        </div>

        {/* PANEL DERECHO */}
        <div className="w-[45%] flex flex-col bg-white">

            {/* LISTA COMENTARIOS */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">

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
                        : "/avatar-default.png"
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
            className="border-t p-4 flex gap-2"
            >
            <input
                type="text"
                placeholder="Escribe un comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 rounded-lg text-sm"
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
>>>>>>> a3bc1d682b2830b98adf1496d1f6c71f86038597
                    />
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 text-sm">{post.email_autor?.split("@")[0] || "Usuario"}</span>
                        <span className="text-xs text-gray-500">{post.email_autor}</span>
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

            {/* MEDIA (IMAGEN/VIDEO) */}
            {mediaSrc && post.tipo !== "video" && (
                <img src={mediaSrc} alt="Contenido" className="w-full max-h-[500px] object-cover mt-2" />
            )}
            {youtubeEmbed && (
                <div className="w-full mt-3 aspect-video">
                    <iframe className="w-full h-full" src={youtubeEmbed} title="YouTube" allowFullScreen></iframe>
                </div>
            )}
            {post.tipo === "video" && mediaSrc && !youtubeEmbed && (
                <video controls className="w-full mt-3"><source src={mediaSrc} /></video>
            )}

            {/* INTERACCIONES */}
            <div className="flex justify-between items-center px-4 py-3 border-t mt-2">
                <div className="flex items-center gap-6">
                    <button onClick={handleLike} className="flex items-center gap-1 text-sm">
                        <Heart size={22} className={`transition ${liked ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
                        <span className="text-gray-600">{likesCount}</span>
                    </button>
                    <button onClick={toggleComments}>
                        <MessageCircle size={22} className={`transition ${showComments ? "text-blue-500" : "text-gray-500"}`} />
                    </button>
                    <button onClick={handleShare}>
                        <Link size={22} className="text-gray-500" />
                    </button>
                </div>
                <button onClick={handleFavorite} className="flex items-center gap-1 text-sm">
                    <Star size={22} className={`transition ${favorite ? "fill-yellow-400 text-yellow-400" : "text-gray-500"}`} />
                    <span className="text-gray-600">{favoritesCount}</span>
                </button>
            </div>

            {/* COMENTARIOS */}
            {showComments && (
                <div className="px-4 pb-4 border-t bg-gray-50">
                    <form onSubmit={handleSubmitComment} className="flex gap-2 mt-3">
                        <input
                            type="text"
                            placeholder="Escribe un comentario..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1 border rounded-lg px-3 py-2 text-sm"
                        />
                        <button type="submit" className="bg-blue-500 text-white px-4 rounded-lg text-sm">Enviar</button>
                    </form>
                    <div className="mt-4 space-y-3">
                        {comments.length === 0 ? <p className="text-xs text-gray-400 text-center">No hay comentarios aún.</p> : 
                            comments.map((c) => (
                                <div key={c.id_interaccion} className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="text-xs font-semibold text-gray-700">{c.email.split("@")[0]}</div>
                                    <div className="text-sm text-gray-600 mt-1">{c.comentario}</div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}

            {/* MODALES (Share y Auth) */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white rounded-2xl p-8 w-[430px] shadow-2xl relative">
                        <h3 className="text-xl font-semibold text-center mb-4">Compartir publicación</h3>
                        <input type="text" value={shareUrl} readOnly className="w-full border rounded-lg px-4 py-3 text-sm bg-gray-50 mb-6" />
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setShowShareModal(false)} className="px-5 py-2 text-sm text-gray-500">Cancelar</button>
                            <button onClick={copyToClipboard} className="px-6 py-2 bg-blue-600 text-white rounded-lg">{copied ? "¡Copiado!" : "Copiar enlace"}</button>
                        </div>
                    </div>
                </div>
            )}

            {showAuthModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-[420px] shadow-2xl text-center">
                        <h3 className="text-xl font-semibold mb-4">Inicia sesión para interactuar</h3>
                        <p className="text-gray-600 text-sm mb-6">Necesitas una cuenta para realizar esta acción en FeedYou.</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setShowAuthModal(false)} className="px-4 py-2 text-sm text-gray-500">Volver</button>
                            <button onClick={() => navigate("/login")} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Iniciar sesión</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}