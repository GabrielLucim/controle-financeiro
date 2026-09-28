import React from "react";
import "./WalletMembersModal.css";

const WalletMembersModal = ({ wallet, onClose }) => {

    const members = [
        {
            userId: 1,
            name: "Usuário dono",
            email: "dono@email.com",
            role: "DONO",
        },
        {
            userId: 2,
            name: "Usuário editor",
            email: "editor@email.com",
            role: "EDITOR",
        },
        {
            userId: 3,
            name: "Usuário visualizador",
            email: "visualizador@email.com",
            role: "VISUALIZADOR",
        },
    ];

    return (
        <div className="wallet-members-overlay">
            <div className="wallet-members-modal">

                <div className="wallet-members-header">
                    <div>
                        <h2>Membros da carteira</h2>

                        <p>
                            {wallet?.name || "Carteira"}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="wallet-members-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="wallet-members-content">

                    <div className="wallet-members-list">

                        {members.map((member) => (
                            <div
                                className="wallet-member-item"
                                key={member.userId}
                            >

                                <div className="wallet-member-info">

                                    <strong>
                                        {member.name}
                                    </strong>

                                    <span>
                                        {member.email}
                                    </span>

                                </div>

                                <span
                                    className={`wallet-member-role role-${member.role.toLowerCase()}`}
                                >
                                    {member.role}
                                </span>

                            </div>
                        ))}

                    </div>

                </div>

                <div className="wallet-members-footer">

                    <button
                        type="button"
                        className="wallet-members-cancel"
                        onClick={onClose}
                    >
                        Fechar
                    </button>

                </div>

            </div>
        </div>
    );
};

export default WalletMembersModal;