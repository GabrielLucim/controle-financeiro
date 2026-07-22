import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem("@FinControl:token");
        const savedUser = localStorage.getItem("@FinControl:user");

        if (savedToken && savedUser) {
            setUser(JSON.parse(savedUser));
        }

        setLoading(false);
    }, []);

    const login = (userData, token) => {
        localStorage.setItem("@FinControl:token", token);

        localStorage.setItem(
            "@FinControl:user",
            JSON.stringify(userData)
        );

        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("@FinControl:token");
        localStorage.removeItem("@FinControl:user");

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!user,
                user,
                login,
                logout,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };