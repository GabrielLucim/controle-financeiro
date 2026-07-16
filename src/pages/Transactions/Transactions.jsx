import React from "react";
import Header from "../../components/Global/Header/Header";
import Footer from "../../components/Global/Footer/Footer";
import { dashboardMock } from "../../mocks/dashboardMock";
import { transactionMock } from "../../mocks/transactionMock";
import "./Transactions.css";

function Transactions() {

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

                    <button className="transactions-button">
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
                        >

                            <option>
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

                            {transactionMock.map(transaction => (

                                <tr key={transaction.id}>

                                    <td>{transaction.description}</td>

                                    <td>{transaction.category}</td>

                                    <td>
                                        {transaction.type === "income"
                                            ? "Receita"
                                            : "Despesa"}
                                    </td>

                                    <td>
                                        R$ {transaction.value.toFixed(2)}
                                    </td>

                                    <td>{transaction.date}</td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </section>

            </main>

            <Footer />

        </div>

    );

}

export default Transactions;