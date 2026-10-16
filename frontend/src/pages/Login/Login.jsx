import React, { useEffect, useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";
import Header from "../../components/Global/Header/Header.jsx";
import Footer from "../../components/Global/Footer/Footer.jsx";
import "./Login.css";
import { authService } from "../../services/authService.js";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const TURNSTILE_SCRIPT_ID = "cloudflare-turnstile-script";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { login, loading, isAuthenticated } = useAuth();

    const [emailOrUsername, setEmailOrUsername] = useState(
        location.state?.email || ""
    );
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [emailOrUsernameError, setEmailOrUsernameError] = useState(false);
    const [showCaptcha, setShowCaptcha] = useState(false);
    const [captchaToken, setCaptchaToken] = useState("");
    const [captchaError, setCaptchaError] = useState("");

    const captchaContainerRef = useRef(null);
    const captchaWidgetIdRef = useRef(null);

    useEffect(() => {
        const remembered = localStorage.getItem("@FinControl:rememberMe");

        if (remembered) {
            try {
                const parsed = JSON.parse(remembered);
                setEmailOrUsername(parsed.emailOrUsername || "");
                setRememberMe(true);
            } catch {
                localStorage.removeItem("@FinControl:rememberMe");
            }
        }
    }, []);

    useEffect(() => {
        if (!showCaptcha) {
            return undefined;
        }

        if (!TURNSTILE_SITE_KEY) {
            setCaptchaError(
                "A verificação de segurança não está configurada."
            );
            return undefined;
        }

        let cancelled = false;
        let script = document.getElementById(TURNSTILE_SCRIPT_ID);

        const renderCaptcha = () => {
            if (
                cancelled ||
                !window.turnstile ||
                !captchaContainerRef.current ||
                captchaWidgetIdRef.current !== null
            ) {
                return;
            }

            captchaWidgetIdRef.current = window.turnstile.render(
                captchaContainerRef.current,
                {
                    sitekey: TURNSTILE_SITE_KEY,
                    callback: (token) => {
                        setCaptchaToken(token);
                        setCaptchaError("");
                    },
                    "expired-callback": () => {
                        setCaptchaToken("");
                        setCaptchaError(
                            "A verificação expirou. Confirme novamente."
                        );
                    },
                    "error-callback": () => {
                        setCaptchaToken("");
                        setCaptchaError(
                            "Não foi possível carregar a verificação. Tente novamente."
                        );
                    }
                }
            );
        };

        if (window.turnstile) {
            renderCaptcha();
        } else {
            if (!script) {
                script = document.createElement("script");
                script.id = TURNSTILE_SCRIPT_ID;
                script.src =
                    "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
                script.async = true;
                script.defer = true;
                document.head.appendChild(script);
            }

            script.addEventListener("load", renderCaptcha);
            script.addEventListener("error", () => {
                if (!cancelled) {
                    setCaptchaError(
                        "Não foi possível carregar o CAPTCHA. Verifique sua conexão."
                    );
                }
            });
        }

        return () => {
            cancelled = true;

            if (script) {
                script.removeEventListener("load", renderCaptcha);
            }

            if (
                captchaWidgetIdRef.current !== null &&
                window.turnstile
            ) {
                window.turnstile.remove(captchaWidgetIdRef.current);
                captchaWidgetIdRef.current = null;
            }
        };
    }, [showCaptcha]);

    const validateEmailOrUsername = (value) => {
        if (!value) return false;

        const isEmailFormat = value.includes("@");

        if (isEmailFormat) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
        }

        return !value.includes(" ");
    };

    const handleEmailOrUsernameChange = (e) => {
        const value = e.target.value;
        setEmailOrUsername(value);

        if (emailOrUsernameError) {
            setEmailOrUsernameError(!validateEmailOrUsername(value));
        }
    };

    const handleEmailOrUsernameBlur = () => {
        setEmailOrUsernameError(
            !validateEmailOrUsername(emailOrUsername)
        );
    };

    const togglePasswordVisibility = () => {
        setShowPassword((previous) => !previous);
    };

    const resetCaptcha = () => {
        setCaptchaToken("");
        setCaptchaError("");

        if (
            captchaWidgetIdRef.current !== null &&
            window.turnstile
        ) {
            window.turnstile.reset(captchaWidgetIdRef.current);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLoading) return;

        const isEmailOrUsernameValid =
            validateEmailOrUsername(emailOrUsername);

        if (!isEmailOrUsernameValid) {
            setEmailOrUsernameError(true);
            setLoginError("Formato de e-mail ou usuário inválido.");
            return;
        }

        if (!password || password.length < 8) {
            setLoginError(
                "A senha deve conter no mínimo 8 caracteres."
            );
            return;
        }

        if (showCaptcha && !captchaToken) {
            setCaptchaError("Conclua a verificação antes de continuar.");
            return;
        }

        setEmailOrUsernameError(false);
        setLoginError("");
        setIsLoading(true);

        try {
            const response = await authService.login(
                emailOrUsername,
                password,
                captchaToken || null
            );

            if (rememberMe) {
                localStorage.setItem(
                    "@FinControl:rememberMe",
                    JSON.stringify({ emailOrUsername })
                );
            } else {
                localStorage.removeItem("@FinControl:rememberMe");
            }

            login(response.user, response.accessToken);

            navigate("/app/dashboard", { replace: true });
        } catch (error) {
            const message = error.response?.data?.message || "";
            const requiresCaptcha =
                message.includes("CAPTCHA_REQUIRED");

            if (requiresCaptcha) {
                setShowCaptcha(true);
                setLoginError(
                    "Você atingiu o limite de tentativas. Confirme que não é um robô para continuar."
                );

                if (captchaToken) {
                    resetCaptcha();
                }
            } else {
                setLoginError(message || "E-mail ou senha incorretos.");

                if (showCaptcha) {
                    resetCaptcha();
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate("/app/dashboard", { replace: true });
        }
    }, [loading, isAuthenticated, navigate]);

    if (loading) {
        return null;
    }

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
                            <label
                                className="form-label"
                                htmlFor="emailOrUsername"
                            >
                                E-mail ou Usuário
                            </label>

                            <input
                                type="text"
                                id="emailOrUsername"
                                className={`form-input ${emailOrUsernameError ? "input-error" : ""
                                    }`}
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
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />

                                <span
                                    className="form-password-toggle"
                                    onClick={togglePasswordVisibility}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" ||
                                            e.key === " "
                                        ) {
                                            e.preventDefault();
                                            togglePasswordVisibility();
                                        }
                                    }}
                                    aria-label={
                                        showPassword
                                            ? "Esconder senha"
                                            : "Mostrar senha"
                                    }
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                            <div className="auth-align-right">
                                <Link
                                    to="/recuperar-senha"
                                    className="auth-link"
                                >
                                    Esqueceu sua senha?
                                </Link>
                            </div>
                        </div>

                        <div className="form-options">
                            <label
                                className="form-checkbox-group"
                                htmlFor="rememberMe"
                            >
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={(e) =>
                                        setRememberMe(e.target.checked)
                                    }
                                />

                                <span className="form-label">
                                    Lembre de mim
                                </span>
                            </label>
                        </div>

                        {showCaptcha && (
                            <div className="captcha-section">
                                <p className="captcha-description">
                                    Confirme que você não é um robô para
                                    continuar.
                                </p>

                                <div
                                    ref={captchaContainerRef}
                                    className="turnstile-container"
                                />

                                {captchaError && (
                                    <p className="form-error">
                                        {captchaError}
                                    </p>
                                )}
                            </div>
                        )}

                        {loginError && (
                            <p className="form-error">{loginError}</p>
                        )}

                        <button
                            type="submit"
                            className="form-button"
                            disabled={isLoading}
                        >
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