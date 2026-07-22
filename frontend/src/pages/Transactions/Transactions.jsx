import React, { useMemo, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Header from "../../components/Global/Header/Header";
import Footer from "../../components/Global/Footer/Footer";
import CreateTransactionModal from "../../components/Transactions/CreateTransactionModal";
import { dashboardMock } from "../../mocks/dashboardMock";
import { transactionMock } from "../../mocks/transactionMock";
import "./Transactions.css";

function Transactions() {

    const [transactions, setTransactions] = useState(transactionMock);

    const [selectedWallet, setSelectedWallet] = useState("all");

    const [showModal, setShowModal] = useState(false);

    const [editingTransaction, setEditingTransaction] = useState(null);

    const filteredTransactions = useMemo(() => {

        if (selectedWallet === "all") {

            return transactions;

        }

        return transactions.filter(

            transaction =>
                transaction.walletId === Number(selectedWallet)

        );

    }, [transactions, selectedWallet]);

    const handleCreateTransaction = (transaction) => {

        if (editingTransaction) {

            setTransactions(prev =>

                prev.map(item =>

                    item.id === transaction.id
                        ? transaction
                        : item

                )

            );

        } else {

            setTransactions(prev => [

                ...prev,

                transaction

            ]);

        }

        setEditingTransaction(null);

        setShowModal(false);

    };

    const handleEditTransaction = (transaction) => {

        setEditingTransaction(transaction);

        setShowModal(true);

    };

    const handleDeleteTransaction = (id) => {

        if (!window.confirm("Deseja realmente excluir esta transação?")) {

            return;

        }

        setTransactions(prev =>

            prev.filter(

                transaction => transaction.id !== id

            )

        );

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

                        <h1 className="transactions-title">

                            Transações

                        </h1>

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

                        <label htmlFor="wallet">

                            Carteira

                        </label>

                        <select
                            id="wallet"
                            className="transactions-select"
                            value={selectedWallet}
                            onChange={(e) =>
                                setSelectedWallet(e.target.value)
                            }
                        >

                            <option value="all">

                                Todas as carteiras

                            </option>

                            {dashboardMock.wallets.map(wallet => (

                                <option
                                    key={wallet.id}
                                    value={wallet.id}
                                >

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

                            {filteredTransactions.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="transactions-empty-table"
                                    >

                                        Nenhuma transação encontrada.

                                    </td>

                                </tr>

                            ) : (

                                filteredTransactions.map(transaction => (

                                    <tr key={transaction.id}>

                                        <td>

                                            {transaction.description}

                                        </td>

                                        <td>

                                            {transaction.category}

                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    transaction.type === "income"
                                                        ? "badge income"
                                                        : "badge expense"
                                                }
                                            >

                                                {transaction.type === "income"
                                                    ? "Receita"
                                                    : "Despesa"}

                                            </span>

                                        </td>

                                        <td
                                            className={
                                                transaction.type === "income"
                                                    ? "value-positive"
                                                    : "value-negative"
                                            }
                                        >

                                            {transaction.type === "income"
                                                ? "+"
                                                : "-"}

                                            R$ {transaction.value.toFixed(2)}

                                        </td>

                                        <td>

                                            {transaction.date}

                                        </td>

                                        <td>

                                            <div className="transaction-actions">

                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        handleEditTransaction(transaction)
                                                    }
                                                    title="Editar"
                                                >

                                                    <FaEdit />

                                                </button>

                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDeleteTransaction(transaction.id)
                                                    }
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
                onSave={handleCreateTransaction}
                wallets={dashboardMock.wallets}
                editingTransaction={editingTransaction}
            />

            <Footer />

        </div>

    );

}

export default Transactions;