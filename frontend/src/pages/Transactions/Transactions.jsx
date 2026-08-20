import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom"; // 👈 Adicionar import do useSearchParams
import { FaEdit, FaTrash } from "react-icons/fa";
import Header from "../../components/Global/Header/Header";
import Footer from "../../components/Global/Footer/Footer";
import CreateTransactionModal from "../../components/Transactions/CreateTransactionModal";
import { transactionService } from "../../services/transactionService";
import { walletService } from "../../services/walletService";
import { categoryService } from "../../services/categoryService";
import "./Transactions.css";

function Transactions() {
    const [searchParams] = useSearchParams();
    const walletIdFromUrl = searchParams.get("walletId");

    const [transactions, setTransactions] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedWallet, setSelectedWallet] = useState(walletIdFromUrl || "all");
    const [showModal, setShowModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (walletIdFromUrl) {
            setSelectedWallet(walletIdFromUrl);
        }
    }, [walletIdFromUrl]);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            const [transData, walletData, catData] = await Promise.all([
                transactionService.getAll(),
                walletService.findAll(),
                categoryService.getAll()
            ]);
            setTransactions(transData);
            setWallets(walletData);
            setCategories(catData);
        } catch (error) {
            console.error("Erro ao carregar dados de transações:", error);
        } finally {
            setLoading(false);
        }
    }

    const filteredTransactions = useMemo(() => {
        if (selectedWallet === "all") {
            return transactions;
        }
        return transactions.filter(
            transaction => Number(transaction.walletId) === Number(selectedWallet)
        );
    }, [transactions, selectedWallet]);

    const handleSaveTransaction = async (transactionData) => {
        try {
            if (editingTransaction) {
                await transactionService.update(editingTransaction.id, transactionData);
            } else {
                await transactionService.create(transactionData);
            }
            await loadData();
            handleCloseModal();
        } catch (error) {
            console.error("Erro ao salvar transação:", error);
            alert(error.response?.data?.message || "Erro ao salvar transação.");
        }
    };

    const handleEditTransaction = (transaction) => {
        setEditingTransaction(transaction);
        setShowModal(true);
    };

    const handleDeleteTransaction = async (id) => {
        if (!window.confirm("Deseja realmente excluir esta transação?")) {
            return;
        }

        try {
            await transactionService.delete(id);
            await loadData();
        } catch (error) {
            console.error("Erro ao excluir transação:", error);
            alert("Erro ao excluir transação.");
        }
    };

    const handleCloseModal = () => {
        setEditingTransaction(null);
        setShowModal(false);
    };

    return (
        <div className="transactions-page">
            <Header />
            <main className="transactions-content">
                <div className="transactions-header">
                    <div>
                        <h1 className="transactions-title">Transações</h1>
                        <p className="transactions-subtitle">
                            Gerencie as movimentações das suas carteiras.
                        </p>
                    </div>

                    <button
                        className="transactions-button"
                        onClick={() => {
                            setEditingTransaction(null);
                            setShowModal(true);
                        }}
                    >
                        + Nova Transação
                    </button>
                </div>

                <section className="transactions-toolbar">
                    <div className="transactions-field">
                        <label htmlFor="wallet">Carteira</label>
                        <select
                            id="wallet"
                            className="transactions-select"
                            value={selectedWallet}
                            onChange={(e) => setSelectedWallet(e.target.value)}
                        >
                            <option value="all">Todas as carteiras</option>
                            {wallets.map(wallet => (
                                <option key={wallet.id} value={wallet.id}>
                                    {wallet.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </section>

                <section className="transactions-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Descrição</th>
                                <th>Categoria</th>
                                <th>Tipo</th>
                                <th>Valor</th>
                                <th>Data</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="transactions-empty-table">
                                        Carregando transações...
                                    </td>
                                </tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="transactions-empty-table">
                                        Nenhuma transação encontrada.
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map(transaction => (
                                    <tr key={transaction.id}>
                                        <td>{transaction.description}</td>
                                        <td>{transaction.categoryName || transaction.category}</td>
                                        <td>
                                            <span
                                                className={
                                                    transaction.type === "INCOME" || transaction.type === "income"
                                                        ? "badge income"
                                                        : "badge expense"
                                                }
                                            >
                                                {transaction.type === "INCOME" || transaction.type === "income"
                                                    ? "Receita"
                                                    : "Despesa"}
                                            </span>
                                        </td>
                                        <td
                                            className={
                                                transaction.type === "INCOME" || transaction.type === "income"
                                                    ? "value-positive"
                                                    : "value-negative"
                                            }
                                        >
                                            {transaction.type === "INCOME" || transaction.type === "income"
                                                ? "+"
                                                : "-"}
                                            R$ {Number(transaction.amount || transaction.value || 0).toFixed(2)}
                                        </td>
                                        <td>
                                            {transaction.date}
                                        </td>
                                        <td>
                                            <div className="transaction-actions">
                                                <button
                                                    className="edit-button"
                                                    onClick={() => handleEditTransaction(transaction)}
                                                    title="Editar"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="delete-button"
                                                    onClick={() => handleDeleteTransaction(transaction.id)}
                                                    title="Excluir"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </section>
            </main>

            <CreateTransactionModal
                open={showModal}
                onClose={handleCloseModal}
                onSave={handleSaveTransaction}
                wallets={wallets}
                categories={categories}
                editingTransaction={editingTransaction}
            />
            <Footer />
        </div>
    );
}

export default Transactions;