import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./Header.css";

const Header = () => {

    const {
        user,
        logout,
        isAuthenticated,
        loading
    } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="page-header">

            <div
                className="logo"
                onClick={() => navigate("/app/dashboard")}
            >
                FinControl
            </div>

            {!loading && isAuthenticated && (
                <>
                    <nav className="header-nav">

                        <NavLink
                            to="/app/dashboard"
                            className={({ isActive }) =>
                                isActive
                                    ? "header-link active"
                                    : "header-link"
                            }
                        >
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/app/transacoes"
                            className={({ isActive }) =>
                                isActive
                                    ? "header-link active"
                                    : "header-link"
                            }
                        >
                            Transações
                        </NavLink>

                        <NavLink
                            to="/app/categorias"
                            className={({ isActive }) =>
                                isActive
                                    ? "header-link active"
                                    : "header-link"
                            }
                        >
                            Categorias
                        </NavLink>

                        <NavLink
                            to="/app/perfil"
                            className={({ isActive }) =>
                                isActive
                                    ? "header-link active"
                                    : "header-link"
                            }
                        >
                            Perfil
                        </NavLink>

                    </nav>

                    <div className="header-user">

                        <span className="header-user-name">
                            {user?.name}
                        </span>

                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Sair
                        </button>

                    </div>
                </>
            )}

        </header>
    );
};

export default Header;