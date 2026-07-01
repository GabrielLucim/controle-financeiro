import React from "react";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Global/Header/Header";
import Footer from "../../components/Global/Footer/Footer";
import "./Profile.css";

function Profile() {
    const { user } = useAuth();

    return (
        <div className="profile-page">

            <Header />

            <main className="profile-content">

                <div className="profile-card">
                
                    <h1 className="profile-title">
                        Meu Perfil
                    </h1>

                    <p className="profile-subtitle">
                        Gerencie suas informações pessoais.
                    </p>

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

                    <div className="profile-section">

                        <label className="profile-label">
                            Senha atual
                        </label>

                        <input
                            className="profile-input"
                            type="password"
                            placeholder="Digite sua senha atual"
                        />

                    </div>

                    <div className="profile-section">

                        <label className="profile-label">
                            Nova senha
                        </label>

                        <input
                            className="profile-input"
                            type="password"
                            placeholder="Digite a nova senha"
                        />

                    </div>

                    <div className="profile-section">

                        <label className="profile-label">
                            Confirmar nova senha
                        </label>

                        <input
                            className="profile-input"
                            type="password"
                            placeholder="Repita a nova senha"
                        />

                    </div>

                    <button className="profile-button">
                        Alterar senha
                    </button>

                </div>

            </main>

            <Footer />

        </div>
    );
}

export default Profile;