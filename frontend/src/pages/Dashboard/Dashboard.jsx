import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Global/Header/Header";
import Footer from "../../components/Global/Footer/Footer";
import { dashboardMock } from "../../mocks/dashboardMock";
import CreateWalletModal from "../../components/Wallet/CreateWalletModal";
import "./Dashboard.css";

function Dashboard() {

    const { user, logout } = useAuth();

    const [summary] = useState(
        dashboardMock.summary
    );

    const [wallets, setWallets] = useState(
        dashboardMock.wallets
    );

    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    const handleLogout = () => {

        logout();
        navigate("/login");

    };

    const handleCreateWallet = (wallet) => {

        setWallets(prev => [

            ...prev,

            {
                id: Date.now(),
                ...wallet
            }

        ]);

        setShowModal(false);

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

                            Visão geral das suas finanças.

                        </p>

                    </div>

                </div>

                <section className="dashboard-summary">

                    <div className="summary-card">

                        <span className="summary-label">

                            Saldo Total

                        </span>

                        <h2 className="summary-value positive">

                            R$ {summary.balance.toFixed(2)}

                        </h2>

                    </div>

                    <div className="summary-card">

                        <span className="summary-label">

                            Receitas

                        </span>

                        <h2 className="summary-value positive">

                            R$ {summary.income.toFixed(2)}

                        </h2>

                    </div>

                    <div className="summary-card">

                        <span className="summary-label">

                            Despesas

                        </span>

                        <h2 className="summary-value negative">

                            R$ {summary.expense.toFixed(2)}

                        </h2>

                    </div>

                </section>

                <section className="wallet-grid">

                    {wallets.map(wallet => (

                        <div
                            key={wallet.id}
                            className="wallet-card"
                            onClick={() => openWallet(wallet.id)}
                        >

                            <h3>

                                {wallet.name}

                            </h3>

                            <p>

                                {wallet.description}

                            </p>

                            <div className="wallet-info">

                                <span
                                    className={`wallet-balance ${wallet.balance >= 0
                                            ? "positive"
                                            : "negative"
                                        }`}
                                >

                                    Saldo: R$ {wallet.balance.toFixed(2)}

                                </span>

                                <span className="wallet-members">

                                    {wallet.members}{" "}
                                    {wallet.members === 1
                                        ? "membro"
                                        : "membros"}

                                </span>

                            </div>

                        </div>

                    ))}

                    <div
                        className="wallet-card add"
                        onClick={() => setShowModal(true)}
                    >

                        <span>

                            + Nova Carteira

                        </span>

                    </div>

                </section>

            </main>

            <CreateWalletModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onCreate={handleCreateWallet}
            />

            <Footer />

        </div>

    );

}

export default Dashboard;