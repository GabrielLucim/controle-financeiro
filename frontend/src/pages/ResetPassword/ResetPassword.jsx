import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import Header from "../../components/Global/Header/Header.jsx";
import Footer from "../../components/Global/Footer/Footer.jsx";
import { authService } from "../../services/authService";
import "./ResetPassword.css";

export const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const initializeResetProcess = async () => {
            if (!token) {
                setError("Token de recuperação inválido ou inexistente.");
                setIsInitialLoading(false);
                return;
            }

            try {
                await authService.startPasswordReset(token);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Token inválido ou expirado. Solicite uma nova recuperação."
                );
            } finally {
                setIsInitialLoading(false);
            }
        };

        initializeResetProcess();
    }, [token]);

    const getPasswordStrength = (pass) => {
        if (!pass) {
            return {
                label: "",
                color: "transparent",
                width: "0%"
            };
        }

        let score = 0;

        if (pass.length >= 8) score++;
        if (/[a-zA-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;

        switch (score) {
            case 1:
                return {
                    label: "Fraca",
                    color: "#e74c3c",
                    width: "33%"
                };
            case 2:
                return {
                    label: "Média",
                    color: "#f1c40f",
                    width: "66%"
                };
            case 3:
                return {
                    label: "Forte",
                    color: "#2ecc71",
                    width: "100%"
                };
            default:
                return {
                    label: "Fraca",
                    color: "#e74c3c",
                    width: "33%"
                };
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

        if (!token) {
            setError("Token de recuperação inválido ou expirado.");
            return;
        }

        if (!password || !confirmPassword) {
            setError("Todos os campos são obrigatórios.");
            return;
        }

        if (password.length < 8) {
            setError("A senha deve conter no mínimo 8 caracteres.");
            return;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError("As senhas não coincidem.");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            await authService.resetPassword(token, password);

            setSuccessMessage("Senha redefinida com sucesso! Redirecionando...");

            setTimeout(() => {
                navigate("/login");
            }, 2500);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Token inválido ou expirado."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <Header />
            <main className="auth-container">
                <div className="auth-card">
                    <h2 className="auth-title">Nova Senha</h2>
                    <p className="auth-subtitle">Crie uma senha forte e segura</p>

                    {isInitialLoading ? (
                        <div className="loading-container">
                            <p>Validando link de recuperação...</p>
                        </div>
                    ) : successMessage ? (
                        <div className="success-banner">
                            <FaCheckCircle className="success-icon" />
                            <p className="success-text">{successMessage}</p>
                        </div>
                    ) : error ? (
                        <div className="error-container">
                            <p className="form-error">{error}</p>
                            <Link to="/esqueci-senha" className="auth-link" style={{ marginTop: "1rem", display: "inline-block" }}>
                                Solicitar novo e-mail de recuperação
                            </Link>
                        </div>
                    ) : (
                        <form className="form" onSubmit={handleSubmit} noValidate>
                            <div className="input-group">
                                <label className="form-label" htmlFor="password">Nova Senha</label>
                                <div className="form-input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        className="form-input"
                                        placeholder="Mínimo 8 caracteres"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <span className="form-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>

                                {password && (
                                    <div className="password-strength-wrapper">
                                        <div className="password-strength-bar-bg">
                                            <div className="password-strength-bar" style={{ width: strength.width, backgroundColor: strength.color }} />
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
                                        placeholder="Repita a nova senha"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        onBlur={handleConfirmPasswordBlur}
                                    />
                                    <span className="form-password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                                {confirmPasswordError && <p className="field-error">{confirmPasswordError}</p>}
                            </div>

                            <button type="submit" className="form-button" disabled={isLoading}>
                                {isLoading ? "Alterando..." : "Redefinir Senha"}
                            </button>
                        </form>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};