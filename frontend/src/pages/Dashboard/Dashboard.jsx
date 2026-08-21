import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Global/Header/Header";
import Footer from "../../components/Global/Footer/Footer";
import CreateWalletModal from "../../components/Wallet/CreateWalletModal";
import DeleteConfirmModal from "../../components/Global/DeleteConfirmModal/DeleteConfirmModal";
import { dashboardService } from "../../services/dashboardService";
import { walletService } from "../../services/walletService";
import { FaTrash } from "react-icons/fa";
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
    const [walletToDelete, setWalletToDelete] = useState(null);

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

    const handleCreateWallet = async (walletData) => {
        try {
            await walletService.create({
                name: walletData.name,
                description: walletData.description
            });

            setShowModal(false);
            await loadDashboard();
        } catch (error) {
            console.error("Erro ao criar carteira:", error);
            alert(error.response?.data?.message || "Erro ao criar carteira.");
        }
    };

    const handleOpenDeleteModal = (e, wallet) => {
        e.stopPropagation();
        setWalletToDelete(wallet);
    };

    const handleConfirmDeleteWallet = async () => {
        if (!walletToDelete) return;

        try {
            await walletService.delete(walletToDelete.id);
            setWalletToDelete(null);
            await loadDashboard();
        } catch (error) {
            console.error("Erro ao excluir carteira:", error);
            alert(error.response?.data?.message || "Erro ao excluir carteira.");
        }
    };

    const openWallet = (id) => {
        navigate(`/app/transacoes?walletId=${id}`);
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
                        <span className="summary-label">Saldo Total</span>
                        <h2 className="summary-value positive">
                            R$ {summary.balance.toFixed(2)}
                        </h2>
                    </div>

                    <div className="summary-card">
                        <span className="summary-label">Receitas</span>
                        <h2 className="summary-value positive">
                            R$ {summary.income.toFixed(2)}
                        </h2>
                    </div>

                    <div className="summary-card">
                        <span className="summary-label">Despesas</span>
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
                            style={{ position: 'relative' }}
                        >
                            <button
                                className="delete-button"
                                title="Excluir Carteira"
                                onClick={(e) => handleOpenDeleteModal(e, wallet)}
                                style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    width: '32px',
                                    height: '32px'
                                }}
                            >
                                <FaTrash size={12} />
                            </button>

                            <h3>{wallet.name}</h3>
                            <p>{wallet.description || "Sem descrição"}</p>
                            <div className="wallet-info">
                                <span
                                    className={`wallet-balance ${wallet.balance >= 0 ? "positive" : "negative"}`}
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
                        <span>+ Nova Carteira</span>
                    </div>
                </section>
            </main>

            <CreateWalletModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onCreate={handleCreateWallet}
            />

            <DeleteConfirmModal
                open={Boolean(walletToDelete)}
                onClose={() => setWalletToDelete(null)}
                onConfirm={handleConfirmDeleteWallet}
                title="Excluir Carteira"
                message={
                    <>
                        Deseja realmente excluir a carteira <strong>"{walletToDelete?.name}"</strong>? Todas as transações vinculadas serão removidas.
                    </>
                }
            />

            <Footer />
        </div>
    );
}

export default Dashboard;