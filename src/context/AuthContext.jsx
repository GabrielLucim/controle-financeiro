import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verifica se já existe um token salvo no navegador ao carregar a página
        const savedToken = localStorage.getItem('@FinControl:token');
        if (savedToken) {
            // Simulação dos dados do usuário logado
            setUser({ name: 'Usuário Teste', email: 'teste@fincontrol.com' });
        }
        setLoading(false);
    }, []);

    // Função para simular o login
    const login = (email, token) => {
        localStorage.setItem('@FinControl:token', token); // Salva o token fictício no navegador
        setUser({ name: 'Usuário Teste', email }); // Atualiza o estado global para "logado"
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