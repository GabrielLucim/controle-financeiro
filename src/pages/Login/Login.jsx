import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";
import Header from "../../components/Global/Header/Header.jsx";
import Footer from "../../components/Global/Footer/Footer.jsx";
import "./Login.css";
import { authService } from "../../services/authService.js";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [emailOrUsernameError, setEmailOrUsernameError] = useState(false);

    useEffect(() => {
        const remembered = localStorage.getItem("@FinControl:rememberMe");
        if (remembered) {
            const parsed = JSON.parse(remembered);
            setEmailOrUsername(parsed.emailOrUsername || "");
            setPassword(parsed.password || "");
            setRememberMe(true);
        }
    }, []);

    const validateEmailOrUsername = (value) => {
        if (!value) return false;
        const isEmailFormat = value.includes("@");
        if (isEmailFormat) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
        } else {
            return !value.includes(" ");
        }
    };

    const handleEmailOrUsernameChange = (e) => {
        const value = e.target.value;
        setEmailOrUsername(value);
        if (emailOrUsernameError) {
            setEmailOrUsernameError(!validateEmailOrUsername(value));
        }
    };

    const handleEmailOrUsernameBlur = () => {
        setEmailOrUsernameError(!validateEmailOrUsername(emailOrUsername));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLoading) return;

        const isEmailOrUsernameValid = validateEmailOrUsername(emailOrUsername);

        if (!isEmailOrUsernameValid) {
            setEmailOrUsernameError(true);
            setLoginError("Formato de e-mail ou usuário inválido.");
            return;
        }

        if (!password || password.length < 6) {
            setLoginError("A senha deve conter no mínimo 6 caracteres.");
            return;
        }

        setEmailOrUsernameError(false);
        setLoginError("");
        setIsLoading(true);

        setTimeout(() => {
            const existingUsers = authService.getUsers();

            // Procura se o e-mail/usuário e a senha batem com alguém cadastrado
            const userFound = existingUsers.find(
                u => u.email === emailOrUsername && u.password === password
            );

            if (userFound) {
                if (rememberMe) {
                    localStorage.setItem("@FinControl:rememberMe", JSON.stringify({ emailOrUsername, password }));
                } else {
                    localStorage.removeItem("@FinControl:rememberMe");
                }

                login(userFound.email, "token-ficticio-123456");
                navigate("/app/dashboard", { replace: true });
            } else {
                setLoginError("E-mail/Nome de Usuário ou senha incorretos.");
            }
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="auth-page">
            <Header />

            <main className="auth-container">
                <div className="auth-card">
                    <h2 className="auth-title">Acesse sua conta</h2>
                    <p className="auth-subtitle">
                        Insira seus dados para entrar
                    </p>

                    <form className="form" onSubmit={handleSubmit} noValidate>
                        <div className="input-group">
                            <label className="form-label" htmlFor="emailOrUsername">
                                E-mail ou Usuário
                            </label>
                            <input
                                type="text"
                                id="emailOrUsername"
                                className={`form-input ${emailOrUsernameError ? "input-error" : ""}`}
                                placeholder="seu@email.com ou seu_usuario"
                                value={emailOrUsername}
                                onChange={handleEmailOrUsernameChange}
                                onBlur={handleEmailOrUsernameBlur}
                            />
                        </div>

                        <div className="input-group">
                            <label className="form-label" htmlFor="password">
                                Senha
                            </label>
                            <div className="form-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="form-input"
                                    placeholder="••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span
                                    className="form-password-toggle"
                                    onClick={togglePasswordVisibility}
                                    role="button"
                                    aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            <div className="auth-align-right">
                                <Link to="/recuperar-senha" className="auth-link">
                                    Esqueceu sua senha?
                                </Link>
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="form-checkbox-group" htmlFor="rememberMe">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span className="form-label">Lembre de mim</span>
                            </label>
                        </div>

                        {loginError && <p className="form-error">{loginError}</p>}

                        <button type="submit" className="form-button" disabled={isLoading}>
                            {isLoading ? "Entrando..." : "Entrar"}
                        </button>

                        <p className="auth-footer-text">
                            Ainda não tem uma conta?{" "}
                            <Link className="auth-link" to="/cadastro">
                                Cadastre-se
                            </Link>
                        </p>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Login;