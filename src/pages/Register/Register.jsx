import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { authService } from "../../services/authService.js";
import Header from "../../components/Global/Header/Header.jsx";
import Footer from "../../components/Global/Footer/Footer.jsx";
import "./Register.css";

const Register = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const getPasswordStrength = (pass) => {
        if (!pass) return { label: "", color: "", width: "0%" };

        let score = 0;
        if (pass.length >= 6) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;

        switch (score) {
            case 1:
                return { label: "Fraca", color: "#e74c3c", width: "33%" };
            case 2:
            case 3:
                return { label: "Média", color: "#f1c40f", width: "66%" };
            case 4:
                return { label: "Forte", color: "#2ecc71", width: "100%" };
            default:
                return { label: "Fraca", color: "#e74c3c", width: "33%" };
        }
    };

    const strength = getPasswordStrength(password);

    const handleConfirmPasswordBlur = () => {
        if (confirmPassword && password !== confirmPassword) {
            setConfirmPasswordError("As senhas não coincidem.");
        } else {
            setConfirmPasswordError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading || successMessage) return;

        if (!name || !email || !password || !confirmPassword) {
            setError("Todos os campos são obrigatórios.");
            return;
        }

        if (password.length < 6) {
            setError("A senha deve conter no mínimo 6 caracteres.");
            return;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError("As senhas não coincidem.");
            return;
        }

        setError("");
        setConfirmPasswordError("");
        setIsLoading(true);

        setTimeout(async () => {
            try {
                await authService.register(name, email, password);

                setIsLoading(false);
                setSuccessMessage("Cadastro realizado com sucesso! Redirecionando...");

                setTimeout(() => {
                    navigate("/login");
                }, 2000);

            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="auth-page">
            <Header />
            <main className="auth-container">
                <div className="auth-card">
                    <h2 className="auth-title">Crie sua conta</h2>
                    <p className="auth-subtitle">Cadastre-se para gerenciar suas finanças</p>

                    {successMessage ? (
                        <div className="success-banner">
                            <FaCheckCircle className="success-icon" />
                            <p className="success-text">{successMessage}</p>
                        </div>
                    ) : (

                        <form className="form" onSubmit={handleSubmit} noValidate>

                            <div className="input-group">
                                <label className="form-label" htmlFor="name">Nome Completo</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="form-input"
                                    placeholder="Seu nome"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <label className="form-label" htmlFor="email">E-mail</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-input"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <label className="form-label" htmlFor="password">Senha</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        className="form-input"
                                        placeholder="No mínimo 6 caracteres"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <span
                                        className="form-password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        role="button"
                                        aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>

                                {password && (
                                    <div className="password-strength-wrapper">
                                        <div className="password-strength-bar-bg">
                                            <div
                                                className="password-strength-bar"
                                                style={{ width: strength.width, backgroundColor: strength.color }}
                                            />
                                        </div>
                                        <span className="password-strength-text" style={{ color: strength.color }}>
                                            Força da senha: {strength.label}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="input-group">
                                <label className="form-label" htmlFor="confirmPassword">Confirme a Senha</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        className={`form-input ${confirmPasswordError ? "input-error" : ""}`}
                                        placeholder="Repita a senha escolhida"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        onBlur={handleConfirmPasswordBlur}
                                    />
                                    <span
                                        className="form-password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        role="button"
                                        aria-label={showConfirmPassword ? "Esconder confirmação de senha" : "Mostrar confirmação de senha"}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                                {confirmPasswordError && <p className="field-error">{confirmPasswordError}</p>}
                            </div>

                            {error && <p className="form-error">{error}</p>}

                            <button type="submit" className="form-button" disabled={isLoading}>
                                {isLoading ? "Cadastrando..." : "Cadastrar"}
                            </button>

                            <p className="auth-footer-text">
                                Já tem uma conta?{" "}
                                <Link className="auth-link" to="/login">
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

export default Register;