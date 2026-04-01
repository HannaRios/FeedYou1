import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PostDetail from "../components/PostDetail";
import { useAuth } from "../context/AuthContext";
import FollowButton from "../components/FollowButton";

const API_URL = import.meta.env.VITE_API_URL;

    export default function PublicProfile() {
    const { email } = useParams();
    const navigate = useNavigate();

    const { user: loggedUser } = useAuth();
    const [showModal, setShowModal] = useState(null);
    const [modalUsers, setModalUsers] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showPostModal, setShowPostModal] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!email) return;

            setLoading(true);
            setProfileData(null);
        try {
            const res = await fetch(
            `${API_URL}/api/usuarios/perfil-completo/${email}?visitor=${loggedUser?.email}`
            );

            const data = await res.json();
            if (res.ok) setProfileData(data);
        } catch (error) {
            console.error("Error cargando perfil:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchProfile();
    }, [email, loggedUser]);

    if (loading)

        return (
        <div className="flex justify-center items-center h-screen text-blue-600 italic">
            Cargando perfil...
        </div>
        );

    if (!profileData)
        return <div className="p-10 text-center">Usuario no encontrado</div>;

    const { user, posts, stats } = profileData;

    const loadFollowData = async (type) => {
        try {
            const res = await fetch(`${API_URL}/api/usuarios/${type}/${email}`);
            const data = await res.json();

            if (res.ok) {
            setModalUsers(data);
            setShowModal(type);
            }
        } catch (error) {
            console.error("Error cargando seguidores:", error);
        }
    };

    return (
        <>
        <Navbar />
        <div className="min-h-screen bg-feedyou pb-20 pt-4">

        <div className="max-w-3xl mx-auto mt-6 px-6">
            {/* CABECERA */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
                <img
                src={
                    user.foto_perfil
                    ? user.foto_perfil.startsWith("http")
                        ? user.foto_perfil
                        : `${API_URL}${user.foto_perfil}`
                    : `${API_URL}/uploads/perfiles/default.png`
                }
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-sm"
                alt="perfil"
                />

                <div className="flex-1 w-full flex flex-col sm:block items-center sm:items-start">
                
                <div className="flex flex-col sm:flex-row items-center gap-3 justify-center sm:justify-start">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {user.nombre}
                    </h1>

                    {loggedUser && loggedUser.email !== user.email && (
                        <div className="scale-90 sm:scale-100 origin-left">
                            <FollowButton
                                currentUser={loggedUser.email}
                                targetUser={user.email}
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center mt-1 justify-center sm:justify-start">
                    <p className="text-blue-500 font-medium">
                        @{user.username}
                    </p>
                </div>

                <p className="text-gray-600 text-sm mt-3 max-w-md mx-auto sm:mx-0">
                    {user.bio || "Este usuario aún no ha agregado una bio."}
                </p>

                {/* STATS */}
                <div className="flex justify-center sm:justify-start gap-6 sm:gap-10 mt-5">
                    <div className="text-center">
                    <span className="block font-bold text-gray-800">
                        {stats.postCount}
                    </span>
                    <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                        Publicaciones
                    </span>
                    </div>

                    <button
                    onClick={() => loadFollowData("seguidores")}
                    className="text-center hover:opacity-60 transition"
                    >
                    <span className="block font-bold text-gray-800">
                        {stats.seguidores}
                    </span>
                    <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                        Seguidores
                    </span>
                    </button>


                    <button
                    onClick={() => loadFollowData("seguidos")}
                    className="text-center hover:opacity-60 transition"
                    >
                    <span className="block font-bold text-gray-800">
                        {stats.seguidos}
                    </span>
                    <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                        Seguidos
                    </span>
                    </button>
                </div>
                </div>
            </div>
            </div>

            {/* GRID PUBLICACIONES */}
            <div className="mt-6 grid grid-cols-3 gap-2">
            {posts.length > 0 ? (
                posts.map((post) => (
                <div
                    key={post.id_publicacion}
                    onClick={() => {
                        setSelectedPost(post);
                        setShowPostModal(true);
                        }}
                    className="aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition"
                >
                    <img
                    src={
                        post.url_media
                        ? post.url_media.startsWith("http")
                            ? post.url_media
                            : `${API_URL}${post.url_media}`
                        : `${API_URL}/uploads/perfiles/default.png`
                    }
                    className="w-full h-full object-cover"
                    alt="post"
                    />
                </div>
                ))
            ) : (
                <p className="col-span-3 text-center py-12 text-gray-400 italic">
                Este usuario no tiene publicaciones aún.
                </p>
            )}
            </div>
        </div>
        </div>
        
                {showPostModal && selectedPost && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">

                    <div className="bg-white w-[95%] sm:w-[600px] h-[90vh] sm:max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">

                    {/* HEADER */}
                    <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">

                        <img src="/logo.png" className="h-11" alt="FeedYou" />

                        <button
                        onClick={() => setShowPostModal(false)}
                        className="text-gray-400 hover:text-gray-800 transition"
                        >
                        ✕
                        </button>

                    </div>

                    {/* CONTENIDO */}
                    <div className="flex justify-center py-6 px-6 flex-1 overflow-y-auto min-h-0">

                        <div className="h-full overflow-y-auto w-full">
                        <PostDetail postId={selectedPost.id_publicacion} isModal />
                        </div>

                    </div>

                    </div>

                </div>
                )}

                {showModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

                <div className="bg-white rounded-2xl w-[90%] sm:w-[480px] h-[80vh] sm:max-h-[75vh] shadow-2xl relative flex flex-col">

                {/* LOGO */}
                <div className="absolute top-6 left-6">
                    <img
                    src="/logo.png"
                    alt="FeedYou"
                    className="h-8 object-contain"
                    />
                </div>

                <button
                    onClick={() => setShowModal(null)}
                    className="absolute top-4 right-4 text-gray-400"
                >
                    ✕
                </button>

                <div className="text-center pt-6 pb-4 border-b">
                    <h3 className="text-lg font-semibold">
                    {showModal === "seguidores" ? "Seguidores" : "Seguidos"}
                    </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">

                    {modalUsers.map((u) => (

                    <div
                        key={u.email}
                        onClick={() => {
                        setShowModal(null);

                        if (u.email === loggedUser?.email) {
                            navigate("/profile");
                        } else {
                            navigate(`/usuario/${u.email}`);
                        }
                        }}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                    >

                        <img
                        src={
                            u.foto_perfil
                            ? `${API_URL}${u.foto_perfil}`
                            : `${API_URL}/uploads/perfiles/default.png`
                        }
                        className="w-10 h-10 rounded-full object-cover"
                        />

                        <div>
                        <p className="font-semibold text-sm">{u.username}</p>
                        <p className="text-xs text-gray-400">{u.nombre}</p>
                        </div>

                    </div>

                    ))}

                </div>

                </div>
            </div>
            )}
        </>
    );
}