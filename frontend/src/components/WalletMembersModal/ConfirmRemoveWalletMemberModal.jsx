import React, { useEffect, useState } from "react";
import "./WalletMemberActionModals.css";

function EditWalletMemberModal({
    open,
    member,
    onClose,
    onSave,
    saving,
    error
}) {
    const [role, setRole] = useState("VISUALIZADOR");

    useEffect(() => {
        if (open && member) {
            setRole(member.role);
        }
    }, [open, member]);

    if (!open || !member) return null;

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave(role);
    };

    return (
        <div
            className="wallet-member-action-overlay"
            onClick={() => {
                if (!saving) onClose();
            }}
        >
            <div
                className="wallet-member-action-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-wallet-member-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="wallet-member-action-header">
                    <div>
                        <h2 id="edit-wallet-member-title">
                            Editar permissão
                        </h2>
                        <p>{member.name}</p>
                    </div>

                    <button
                        type="button"
                        className="wallet-member-action-close"
                        onClick={onClose}
                        disabled={saving}
                        aria-label="Fechar"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="wallet-member-action-body">
                        <label htmlFor="wallet-member-role">
                            Nível de acesso
                        </label>

                        <select
                            id="wallet-member-role"
                            value={role}
                            onChange={(event) => setRole(event.target.value)}
                            disabled={saving}
                        >
                            <option value="EDITOR">Editor</option>
                            <option value="VISUALIZADOR">Visualizador</option>
                        </select>

                        {error && (
                            <div className="wallet-member-action-error">
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="wallet-member-action-footer">
                        <button
                            type="button"
                            className="wallet-member-footer-button wallet-member-cancel"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="wallet-member-footer-button wallet-member-confirm"
                            disabled={saving}
                        >
                            {saving ? "Salvando..." : "Salvar permissão"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditWalletMemberModal;
