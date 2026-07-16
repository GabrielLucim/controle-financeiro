import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login/Login.jsx";
import Register from "../pages/Register/Register.jsx";
import { ForgotPassword } from "../pages/ForgotPassword/ForgotPassword.jsx";
import { ResetPassword } from "../pages/ResetPassword/ResetPassword.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Profile from "../pages/Profile/Profile.jsx";
import { ProtectedRoute } from "../components/ProtectedRoute.jsx";
import Transactions from "../pages/Transactions/Transactions.jsx";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<Login />} />

                <Route path="/cadastro" element={<Register />} />

                <Route
                    path="/recuperar-senha"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/redefinir-senha/:token"
                    element={<ResetPassword />}
                />

                <Route
                    path="/app/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/app/transacoes"
                    element={
                        <ProtectedRoute>
                            <Transactions />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/app/perfil"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;