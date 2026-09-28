import React, { useEffect, useRef } from "react";
import "./WalletMembersModal.css";

function WalletMembersModal({ open, wallet, onClose }) {
    const modalRef = useRef(null);

    useEffect(() => {
        if (!open || !modalRef.current) return;

        const focusable = modalRef.current.querySelectorAll(
            'button,input,select,textarea,[tabindex]:not([tabindex="-1"])'
        );

        if (focusable.length > 0) {
            focusable[0].focus();
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
                return;
            }

            if (event.key !== "Tab") return;

            const currentFocusable = modalRef.current.querySelectorAll(
                'button,input,select,textarea,[tabindex]:not([tabindex="-1"])'
            );

            if (currentFocusable.length === 0) return;

            const first = currentFocusable[0];
            const last = currentFocusable[currentFocusable.length - 1];

            if (event.shiftKey) {
                if (document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    if (!open) return null;

    const members = [
        {
            userId: 1,
            name: "Usuário dono",
            email: "dono@email.com",
            role: "DONO"
        },
        {
            userId: 2,
            name: "Usuário editor",
            email: "editor@email.com",
            role: "EDITOR"
        },
        {
            userId: 3,
            name: "Usuário visualizador",
            email: "visualizador@email.com",
            role: "VISUALIZADOR"
        }
    ];

    return (
        <div
            className="wallet-members-modal-overlay"
            onClick={onClose}
        >
            <div
                className="wallet-members-modal"
                ref={modalRef}
                onClick={(event) => event.stopPropagation()}
            >
                <div className="wallet-members-header">
                    <div>
                        <h2 className="wallet-members-title">
                            Membros da Carteira
                        </h2>

                        <p className="wallet-members-wallet-name">
                            {wallet?.name || "Carteira"}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="wallet-members-close"
                        onClick={onClose}
                        aria-label="Fechar"
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
            </div>
        </div>
    );
}

export default WalletMembersModal;