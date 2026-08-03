import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Global/Header/Header";
import Footer from "../../components/Global/Footer/Footer";
import CreateWalletModal from "../../components/Wallet/CreateWalletModal";
import { dashboardService } from "../../services/dashboardService";
import "./Dashboard.css";

function Dashboard() {

    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expense: 0
    });

    const [wallets, setWallets] = useState([]);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {

        loadDashboard();

    }, []);

    async function loadDashboard() {

        try {

            const data = await dashboardService.getDashboard();

            setSummary({
                balance: Number(data.summary.balance),
                income: Number(data.summary.income),
                expense: Number(data.summary.expense)
            });

            setWallets(
                data.wallets.map(wallet => ({
                    ...wallet,
                    balance: Number(wallet.balance)
                }))
            );

        } catch (error) {

            console.error("Erro ao carregar dashboard:", error);

        }

    }

    const handleLogout = () => {

        logout();
        navigate("/login");

    };

    const handleCreateWallet = async () => {

        setShowModal(false);

        await loadDashboard();

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

                                {wallet.description || "Sem descrição"}

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