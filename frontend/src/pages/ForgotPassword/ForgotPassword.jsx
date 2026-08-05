import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Header from "../../components/Global/Header/Header.jsx";
import Footer from "../../components/Global/Footer/Footer.jsx";
import { authService } from "../../services/authService";
import "./ForgotPassword.css";

export const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (isLoading) return;

        if (!email) {
            setError("Campo obrigatório");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("E-mail inválido");
            return;
        }

        setError("");
        setSuccessMessage("");
        setIsLoading(true);

        try {

            await authService.forgotPassword(email);

            setSuccessMessage(
                "Se o e-mail informado estiver cadastrado, um link de recuperação foi enviado."
            );

        } catch (err) {

            console.error(err);

            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Erro ao enviar e-mail. Tente novamente.");
            }

        } finally {

            setIsLoading(false);

        }

    };

    return (
        <div className="auth-page">

            <Header />

            <main className="auth-container">

                <div className="auth-card">

                    <h2 className="auth-title">
                        Recuperar Senha
                    </h2>

                    <p className="auth-subtitle">
                        Informe seu e-mail para receber as instruções
                    </p>

                    {successMessage ? (

                        <div className="success-banner">

                            <FaCheckCircle className="success-icon" />

                            <p className="success-text">
                                {successMessage}
                            </p>

                            <Link
                                className="auth-link"
                                style={{
                                    marginTop: "20px",
                                    display: "block"
                                }}
                                to="/login"
                            >
                                Voltar para o Login
                            </Link>

                        </div>

                    ) : (

                        <form
                            className="form"
                            onSubmit={handleSubmit}
                            noValidate
                        >

                            <div className="input-group">

                                <label
                                    className="form-label"
                                    htmlFor="email"
                                >
                                    E-mail Cadastrado
                                </label>

                                <input
                                    type="email"
                                    id="email"
                                    className={`form-input ${error ? "input-error" : ""}`}
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                {error && (
                                    <p className="field-error">
                                        {error}
                                    </p>
                                )}

                            </div>

                            <button
                                type="submit"
                                className="form-button"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? "Enviando..."
                                    : "Enviar Link"}
                            </button>

                            <p className="auth-footer-text">

                                Lembrou a senha?{" "}

                                <Link
                                    className="auth-link"
                                    to="/login"
                                >
                                    Entre aqui
                                </Link>

                            </p>

                        </form>

                    )}

                </div>

            </main>

            <Footer />

        </div>
    );

};