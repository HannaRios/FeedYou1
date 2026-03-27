import { createContext, useContext, useState, useEffect } from "react";

// Crear contexto
    const AuthContext = createContext();

    // Hook personalizado
    export const useAuth = () => {
    return useContext(AuthContext);
    };

    // Provider
    export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cargar usuario al iniciar la app
    useEffect(() => {

        const storedProfile = localStorage.getItem("profileData");

        if (storedProfile) {
        setUser(JSON.parse(storedProfile));
        }

        setLoading(false);

    }, []);

    // Login
    const login = (userData) => {

        setUser(userData);

        localStorage.setItem(
        "profileData",
        JSON.stringify(userData)
        );

    };

    // Logout
    const logout = () => {

        setUser(null);

        localStorage.clear();

    };

    return (
        <AuthContext.Provider value={{
        user,
        login,
        logout,
        loading
        }}>
        {children}
        </AuthContext.Provider>
    );

};
