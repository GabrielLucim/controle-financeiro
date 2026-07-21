import React, { useMemo, useState } from "react";
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

        setTransactions(prev => [
            ...prev,
            transaction
        ]);

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
                        onClick={() => setShowModal(true)}
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

                            {dashboardMock.map(wallet => (

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

                            </tr>

                        </thead>

                        <tbody>

                            {filteredTransactions.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
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
                                            {transaction.type === "income"
                                                ? "Receita"
                                                : "Despesa"}
                                        </td>

                                        <td>
                                            R$ {transaction.value.toFixed(2)}
                                        </td>

                                        <td>
                                            {transaction.date}
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
                onClose={() => setShowModal(false)}
                onCreate={handleCreateTransaction}
                wallets={dashboardMock}
            />

            <Footer />

        </div>

    );

}

export default Transactions;