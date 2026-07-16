import React from "react";
import Header from "../../components/Global/Header/Header";
import Footer from "../../components/Global/Footer/Footer";
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

                    <label htmlFor="wallet">
                        Carteira
                    </label>

                    <select
                        id="wallet"
                        className="transactions-select"
                    >
                        <option>
                            Selecione uma carteira
                        </option>
                    </select>

                </section>

                <section className="transactions-empty">

                    <h3>
                        Nenhuma transação encontrada
                    </h3>

                    <p>
                        Selecione uma carteira ou cadastre uma nova transação.
                    </p>

                </section>

            </main>

            <Footer />

        </div>

    );

}

export default Transactions;