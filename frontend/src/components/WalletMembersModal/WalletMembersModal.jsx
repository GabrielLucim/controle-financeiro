import React, { useEffect, useRef, useState } from "react";
import { walletMemberService } from "../../services/walletMemberService";
import AddWalletMemberModal from "../AddWalletMemberModal/AddWalletMemberModal";
import EditWalletMemberModal from "./EditWalletMemberModal";
import ConfirmRemoveWalletMemberModal from "./ConfirmRemoveWalletMemberModal";
import "./WalletMembersModal.css";

function getActionError(err, fallback) {
    const message = err.response?.data?.message;

    if (message === "Carteira não encontrada.") {
        return "Não foi possível realizar esta ação. Verifique se você é o dono da carteira.";
    }

    return message || fallback;
}

function WalletMembersModal({ open, wallet, onClose }) {
    const modalRef = useRef(null);

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");
    const [addMemberOpen, setAddMemberOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [removingMember, setRemovingMember] = useState(null);
    const [savingRole, setSavingRole] = useState(false);
    const [removingMemberId, setRemovingMemberId] = useState(null);

    useEffect(() => {
        if (!open || addMemberOpen || editingMember || removingMember || !modalRef.current) {
            return;
        }

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

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, addMemberOpen, editingMember, removingMember, onClose]);

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
            setEditingMember(null);
            setRemovingMember(null);
            setActionError("");
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
        if (!wallet?.id) {
            throw new Error("Não foi possível identificar a carteira.");
        }

        try {
            const addedMember = await walletMemberService.add(wallet.id, member);

            setMembers((currentMembers) => {
                const withoutDuplicate = currentMembers.filter(
                    (currentMember) => currentMember.userId !== addedMember.userId
                );

                return [...withoutDuplicate, addedMember];
            });

            setError("");
            setActionError("");
        } catch (err) {
            throw new Error(
                err.response?.data?.message ||
                "Não foi possível adicionar o membro à carteira."
            );
        }
    };

    const handleSaveRole = async (role) => {
        if (!wallet?.id || !editingMember) return;

        try {
            setSavingRole(true);
            setActionError("");

            const updatedMember = await walletMemberService.update(
                wallet.id,
                editingMember.userId,
                { role }
            );

            setMembers((currentMembers) =>
                currentMembers.map((member) =>
                    member.userId === updatedMember.userId
                        ? updatedMember
                        : member
                )
            );

            setEditingMember(null);
        } catch (err) {
            setActionError(
                getActionError(
                    err,
                    "Não foi possível atualizar a permissão do membro."
                )
            );
        } finally {
            setSavingRole(false);
        }
    };

    const handleRemoveMember = async () => {
        if (!wallet?.id || !removingMember) return;

        try {
            setRemovingMemberId(removingMember.userId);
            setActionError("");

            await walletMemberService.remove(
                wallet.id,
                removingMember.userId
            );

            setMembers((currentMembers) =>
                currentMembers.filter(
                    (member) => member.userId !== removingMember.userId
                )
            );

            setRemovingMember(null);
        } catch (err) {
            setActionError(
                getActionError(
                    err,
                    "Não foi possível remover o membro da carteira."
                )
            );

            setRemovingMember(null);
        } finally {
            setRemovingMemberId(null);
        }
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
                            onClick={() => {
                                setActionError("");
                                setAddMemberOpen(true);
                            }}
                        >
                            + Adicionar membro
                        </button>

                        {actionError && (
                            <div className="wallet-members-message wallet-members-error">
                                {actionError}
                            </div>
                        )}

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
                                {members.map((member) => {
                                    const isOwner = member.role === "DONO";

                                    return (
                                        <div
                                            className="wallet-member-item"
                                            key={member.userId}
                                        >
                                            <div className="wallet-member-info">
                                                <strong>{member.name}</strong>
                                                <span>{member.email}</span>
                                            </div>

                                            <div className="wallet-member-actions">
                                                <span
                                                    className={`wallet-member-role role-${member.role.toLowerCase()}`}
                                                >
                                                    {member.role}
                                                </span>

                                                {!isOwner && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="wallet-member-action"
                                                            onClick={() => {
                                                                setActionError("");
                                                                setEditingMember(member);
                                                            }}
                                                            disabled={
                                                                removingMemberId === member.userId
                                                            }
                                                        >
                                                            Editar
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="wallet-member-action wallet-member-remove"
                                                            onClick={() => {
                                                                setActionError("");
                                                                setRemovingMember(member);
                                                            }}
                                                            disabled={
                                                                removingMemberId === member.userId
                                                            }
                                                        >
                                                            Remover
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
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

            <EditWalletMemberModal
                open={Boolean(editingMember)}
                member={editingMember}
                onClose={() => {
                    if (!savingRole) {
                        setEditingMember(null);
                        setActionError("");
                    }
                }}
                onSave={handleSaveRole}
                saving={savingRole}
                error={actionError}
            />

            <ConfirmRemoveWalletMemberModal
                open={Boolean(removingMember)}
                member={removingMember}
                onClose={() => {
                    if (removingMemberId === null) {
                        setRemovingMember(null);
                        setActionError("");
                    }
                }}
                onConfirm={handleRemoveMember}
                removing={removingMemberId !== null}
                error={actionError}
            />
        </>
    );
}

export default WalletMembersModal;
