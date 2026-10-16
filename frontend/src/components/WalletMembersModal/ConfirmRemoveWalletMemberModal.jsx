
import React from "react";
import "./WalletMemberActionModals.css";

function ConfirmRemoveWalletMemberModal({
    open,
    member,
    onClose,
    onConfirm,
    removing,
    error
}) {
    if (!open || !member) return null;

    return (
        <div
            className="wallet-member-action-overlay"
            onClick={() => {
                if (!removing) onClose();
            }}
        >
            <div
                className="wallet-member-action-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="remove-wallet-member-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="wallet-member-action-header">
                    <div>
                        <h2 id="remove-wallet-member-title">
                            Remover membro
                        </h2>
                        <p>Confirme a remoção da carteira compartilhada.</p>
                    </div>

                    <button
                        type="button"
                        className="wallet-member-action-close"
                        onClick={onClose}
                        disabled={removing}
                        aria-label="Fechar"
                    >
                        ×
                    </button>
                </div>

                <div className="wallet-member-action-body">
                    <p>
                        Tem certeza de que deseja remover{" "}
                        <strong>{member.name}</strong> desta carteira?
                    </p>

                    <p className="wallet-member-remove-warning">
                        Essa pessoa perderá o acesso à carteira compartilhada.
                    </p>

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
                        disabled={removing}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        className="wallet-member-footer-button wallet-member-delete"
                        onClick={onConfirm}
                        disabled={removing}
                    >
                        {removing ? "Removendo..." : "Remover membro"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmRemoveWalletMemberModal;
