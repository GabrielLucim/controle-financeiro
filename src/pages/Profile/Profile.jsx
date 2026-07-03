import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import Header from "../../components/Global/Header/Header";
import Footer from "../../components/Global/Footer/Footer";
import "./Profile.css";

function Profile() {

    const { user } = useAuth();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const getPasswordStrength = (pass) => {

        if (!pass)
            return {
                label: "",
                color: "",
                width: "0%"
            };

        let score = 0;

        if (pass.length >= 6) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
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
            case 4:
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

    const strength = getPasswordStrength(newPassword);

    const handleConfirmPasswordBlur = () => {

        if (
            confirmPassword &&
            confirmPassword !== newPassword
        ) {

            setConfirmPasswordError(
                "As senhas não coincidem."
            );

        } else {

            setConfirmPasswordError("");

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (isLoading) return;

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            setError(
                "Todos os campos são obrigatórios."
            );

            return;

        }

        if (newPassword.length < 6) {

            setError(
                "A nova senha deve possuir no mínimo 6 caracteres."
            );

            return;

        }

        if (newPassword !== confirmPassword) {

            setConfirmPasswordError(
                "As senhas não coincidem."
            );

            return;

        }

        setError("");
        setConfirmPasswordError("");
        setIsLoading(true);

        try {

            await authService.changePassword(
                user.email,
                currentPassword,
                newPassword
            );

            setSuccessMessage(
                "Senha alterada com sucesso!"
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (err) {

            setError(err.message);

        } finally {

            setIsLoading(false);

        }

    };

    return (
        <div className="profile-page">
            <Header />
            <main className="profile-content">
                <div className="profile-card">
                    <div className="profile-header">
                        <h1 className="profile-title">
                            Meu Perfil
                        </h1>
                        <p className="profile-subtitle">
                            Gerencie suas informações pessoais.
                        </p>
                    </div>
                    <div className="profile-section">
                        <label className="profile-label">
                            Nome
                        </label>
                        <input
                            className="profile-input"
                            type="text"
                            value={user?.name || ""}
                            disabled
                        />
                    </div>
                    <div className="profile-section">
                        <label className="profile-label">
                            E-mail
                        </label>
                        <input
                            className="profile-input"
                            type="email"
                            value={user?.email || ""}
                            disabled
                        />
                    </div>
                    <hr className="profile-divider" />
                    <h2 className="profile-section-title">
                        Alterar senha
                    </h2>
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="profile-section">
                            <label className="profile-label">
                                Senha atual
                            </label>
                            <div className="form-input-wrapper">
                                <input
                                    className="profile-input"
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="Digite sua senha atual"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                                <span
                                    className="form-password-toggle"
                                    onClick={() =>
                                        setShowCurrentPassword(!showCurrentPassword)
                                    }
                                >
                                    {showCurrentPassword ? (
                                        <FaEyeSlash />
                                    ) : (
                                        <FaEye />
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="profile-section">
                            <label className="profile-label">
                                Nova senha
                            </label>
                            <div className="form-input-wrapper">
                                <input
                                    className="profile-input"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Digite a nova senha"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <span
                                    className="form-password-toggle"
                                    onClick={() =>
                                        setShowNewPassword(!showNewPassword)
                                    }
                                >
                                    {showNewPassword ? (
                                        <FaEyeSlash />
                                    ) : (
                                        <FaEye />
                                    )}
                                </span>
                            </div>
                            {newPassword && (
                                <div className="password-strength-wrapper">
                                    <div className="password-strength-bar-bg">
                                        <div
                                            className="password-strength-bar"
                                            style={{
                                                width: strength.width,
                                                backgroundColor: strength.color
                                            }}
                                        />
                                    </div>
                                    <span
                                        className="password-strength-text"
                                        style={{
                                            color: strength.color
                                        }}
                                    >
                                        Força da senha: {strength.label}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="profile-section">
                            <label className="profile-label">
                                Confirmar nova senha
                            </label>
                            <div className="form-input-wrapper">
                                <input
                                    className={`profile-input ${confirmPasswordError ? "input-error" : ""}`}
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Repita a nova senha"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    onBlur={handleConfirmPasswordBlur}
                                />
                                <span
                                    className="form-password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <FaEyeSlash />
                                    ) : (
                                        <FaEye />
                                    )}
                                </span>

                            </div>
                            {confirmPasswordError && (
                                <p className="field-error">
                                    {confirmPasswordError}
                                </p>
                            )}
                        </div>
                        {error && (
                            <p className="form-error">
                                {error}
                            </p>
                        )}
                        {successMessage && (
                            <div className="success-banner">
                                <FaCheckCircle className="success-icon" />
                                <p className="success-text">
                                    {successMessage}
                                </p>
                            </div>
                        )}
                        <button
                            type="submit"
                            className="profile-button"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? "Alterando..."
                                : "Alterar senha"}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Profile;