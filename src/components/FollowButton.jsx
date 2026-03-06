import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function FollowButton({ currentUser, targetUser }) {
    const [following, setFollowing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Verificar si ya sigo a este usuario
    useEffect(() => {
        const checkFollow = async () => {
        try {
            const res = await fetch(
            `${API_URL}/api/usuarios/sigo?seguidor=${currentUser}&seguido=${targetUser}`
            );

            const data = await res.json();
            setFollowing(data.siguiendo);
        } catch (error) {
            console.error("Error verificando seguimiento:", error);
        }
        };

        if (currentUser && targetUser) {
        checkFollow();
        }
    }, [currentUser, targetUser]);

    const toggleFollow = async () => {
        if (loading) return;

        setLoading(true);

        try {
        if (following) {
            await fetch(`${API_URL}/api/usuarios/dejar-seguir`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                seguidor: currentUser,
                seguido: targetUser,
            }),
            });

            setFollowing(false);
        } else {
            await fetch(`${API_URL}/api/usuarios/seguir`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                seguidor: currentUser,
                seguido: targetUser,
            }),
            });

            setFollowing(true);
        }
        } catch (error) {
        console.error("Error cambiando estado de seguimiento:", error);
        } finally {
        setLoading(false);
        }
    };

    return (
    <span
        onClick={toggleFollow}
        className={`font-medium cursor-pointer transition-colors duration-200 ${
        following
            ? "text-gray-400 hover:text-gray-600"
            : "text-blue-500 hover:text-blue-600"
        }`}
    >
        {loading ? "..." : following ? "Siguiendo" : "Seguir"}
    </span>
    );
}