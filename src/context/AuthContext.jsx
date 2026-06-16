import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('@FinControl:token');
        if (savedToken) {
            setUser({ name: 'Administrador', email: 'admin' });
        }
        setLoading(false);
    }, []);

    const login = (email, token) => {
        localStorage.setItem('@FinControl:token', token);
        setUser({ name: 'Administrador', email });
    };

    // Função para fazer logout
    const logout = () => {
        localStorage.removeItem('@FinControl:token'); // Remove o token do navegador
        setUser(null); // Atualiza o estado para "deslogado"
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };