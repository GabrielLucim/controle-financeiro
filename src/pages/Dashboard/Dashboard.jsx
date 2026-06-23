import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Global/Header/Header";
import Footer from "../../components/Global/Footer/Footer";
import "./Dashboard.css";

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <><Header /><div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>

            <p className="dashboard-subtitle">
                Área principal do sistema
            </p>

            <p className="dashboard-user">
                Bem-vindo!
            </p>

            <button
                className="dashboard-button"
                onClick={handleLogout}
            >
                Sair
            </button>
        </div><Footer /></>
    );
}

export default Dashboard;