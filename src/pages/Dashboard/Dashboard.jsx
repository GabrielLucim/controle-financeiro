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
        <div className="dashboard-page">
            <Header />

            <main className="dashboard-content">

                <div className="dashboard-header">

                    <div>
                        <h1 className="dashboard-title">
                            Olá, {user?.name || "Usuário"}
                        </h1>

                        <p className="dashboard-subtitle">
                            Bem-vindo ao FinControl.
                        </p>
                    </div>

                </div>

                <section className="dashboard-cards">

                    <div className="dashboard-card">
                        <h3>Saldo Atual</h3>
                        <span>R$ 0,00</span>
                    </div>

                    <div className="dashboard-card">
                        <h3>Receitas</h3>
                        <span>R$ 0,00</span>
                    </div>

                    <div className="dashboard-card">
                        <h3>Despesas</h3>
                        <span>R$ 0,00</span>
                    </div>

                    <div className="dashboard-card">
                        <h3>Lançamentos</h3>
                        <span>0</span>
                    </div>

                </section>

                <section className="dashboard-actions">

                    <h2>Ações rápidas</h2>

                    <div className="dashboard-actions-grid">

                        <button
                            className="action-button"
                            onClick={() => navigate("/transactions")}
                        >
                            Nova Receita
                        </button>

                        <button
                            className="action-button"
                            onClick={() => navigate("/transactions")}
                        >
                            Nova Despesa
                        </button>

                        <button
                            className="action-button"
                            onClick={() => navigate("/categories")}
                        >
                            Nova Categoria
                        </button>

                    </div>

                </section>

                <section className="dashboard-panel">

                    <div className="dashboard-panel-header">
                        <h2>Últimas movimentações</h2>

                        <button
                            className="see-all-button"
                            onClick={() => navigate("/transactions")}
                        >
                            Ver todas
                        </button>
                    </div>

                    <div className="dashboard-table">

                        <div className="dashboard-table-header">
                            <span>Data</span>
                            <span>Categoria</span>
                            <span>Tipo</span>
                            <span>Valor</span>
                        </div>

                        <div className="dashboard-empty">
                            Nenhuma movimentação cadastrada.
                        </div>

                    </div>

                </section>

            </main>

            <Footer />
        </div>
    );
}

export default Dashboard;