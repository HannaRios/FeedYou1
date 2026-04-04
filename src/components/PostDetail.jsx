import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function PostDetail({ postId, isAdminMode }) {

    const params = useParams();
    const id = postId || params.id; 

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const isStandalonePage = !postId;
    const { user } = useAuth();

useEffect(() => {
    if (!id) return;
    setLoading(true);
    const fetchPost = async () => {
        try {
            const url = user?.email
                ? `${API_URL}/api/publicaciones/${id}?email=${user.email}`
                : `${API_URL}/api/publicaciones/${id}`;

            const res = await fetch(url);
            console.log("STATUS:", res.status);
            const data = await res.json();
            console.log("DATA:", data);
            setPost(data);

        } catch (error) {
            console.error("Error cargando publicación:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchPost();

}, [id, user]);

    if (loading) {
        return <p className="text-center mt-10">Cargando publicación...</p>;
    }

    if (!post) {
        return <p className="text-center mt-10">Publicación no encontrada</p>;
    }

    return (
        <div className="flex justify-center">
            <div className="w-full">
                <PostCard 
                post={post} 
                showUser 
                isAdminMode={isAdminMode}
                />
            </div>
        </div>
    );
}