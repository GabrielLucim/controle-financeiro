import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // Se ainda estiver checando o localStorage, mostra uma tela de carregamento
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-xl font-semibold text-blue-600 animate-pulse">Carregando...</div>
            </div>
        );
    }

    // Se não estiver logado, redireciona à força para a tela de login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};