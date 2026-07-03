import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Global/Header/Header";
import Footer from "../../components/Global/Footer/Footer";
import { dashboardMock } from "../../mocks/dashboardMock";
import "./Dashboard.css";

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const openWallet = (id) => {
        navigate(`/app/wallets/${id}`);
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
                            Suas carteiras financeiras
                        </p>
                    </div>
                </div>
                <section className="wallet-grid">
                    {dashboardMock.map(wallet => (
                        <div
                            key={wallet.id}
                            className="wallet-card"
                            onClick={() => openWallet(wallet.id)}
                        >
                            <h3>{wallet.name}</h3>
                            <p>{wallet.description}</p>
                            <div className="wallet-info">
                                <span
                                    className={`wallet-balance ${wallet.balance >= 0 ? "positive" : "negative"
                                        }`}
                                >
                                    Saldo: R$ {wallet.balance.toFixed(2)}
                                </span>

                                <span className="wallet-members">
                                    {wallet.members} {wallet.members === 1 ? "membro" : "membros"}
                                </span>
                            </div>
                        </div>
                    ))}
                    <div className="wallet-card add">
                        <span>+ Nova Carteira</span>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
export default Dashboard;