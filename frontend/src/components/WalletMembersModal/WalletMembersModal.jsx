import React, { useEffect, useRef, useState } from "react";
import { walletMemberService } from "../../services/walletMemberService";
import AddWalletMemberModal from "../AddWalletMemberModal/AddWalletMemberModal";
import "./WalletMembersModal.css";

function WalletMembersModal({ open, wallet, onClose }) {
    const modalRef = useRef(null);

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [addMemberOpen, setAddMemberOpen] = useState(false);

    useEffect(() => {
        if (!open || addMemberOpen || !modalRef.current) return;

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
            } else if (document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, addMemberOpen, onClose]);

    useEffect(() => {
        if (!open || !wallet?.id) {
            return;
        }

        const loadMembers = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await walletMemberService.findAll(wallet.id);

                setMembers(data);
            } catch (err) {
                console.error("Erro ao carregar membros da carteira:", err);

                setMembers([]);
                setError("Não foi possível carregar os membros da carteira.");
            } finally {
                setLoading(false);
            }
        };

        loadMembers();
    }, [open, wallet?.id]);

    useEffect(() => {
        if (!open) {
            setAddMemberOpen(false);
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [open]);

    if (!open) return null;

    const handleAddMember = async (member) => {
        console.log("Membro a adicionar:", member);
    };

    return (
        <>
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
                        <button
                            type="button"
                            className="wallet-members-add"
                            onClick={() => setAddMemberOpen(true)}
                        >
                            + Adicionar membro
                        </button>

                        {loading && (
                            <div className="wallet-members-message">
                                Carregando membros...
                            </div>
                        )}

                        {!loading && error && (
                            <div className="wallet-members-message wallet-members-error">
                                {error}
                            </div>
                        )}

                        {!loading && !error && members.length === 0 && (
                            <div className="wallet-members-message">
                                Nenhum membro encontrado.
                            </div>
                        )}

                        {!loading && !error && members.length > 0 && (
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
                        )}
                    </div>
                </div>
            </div>

            <AddWalletMemberModal
                open={addMemberOpen}
                onClose={() => setAddMemberOpen(false)}
                onAdd={handleAddMember}
            />
        </>
    );
}

export default WalletMembersModal;