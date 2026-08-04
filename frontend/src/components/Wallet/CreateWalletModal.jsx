import React, { useEffect, useRef, useState } from "react";
import "./CreateWalletModal.css";

function CreateWalletModal({ open, onClose, onCreate }) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    const modalRef = useRef(null);

    const resetFields = () => {
        setName("");
        setDescription("");
        setError("");
    };

    const handleClose = () => {
        resetFields();
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("Informe o nome da carteira.");
            return;
        }

        onCreate({
            name: name.trim(),
            description: description.trim()
        });

        resetFields();
    };

    useEffect(() => {
        if (!open || !modalRef.current) return;

        const focusable = modalRef.current.querySelectorAll(
            'button,input,textarea,select,[tabindex]:not([tabindex="-1"])'
        );

        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        first.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                handleClose();
                return;
            }

            if (event.key !== "Tab") return;

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

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open]);

    if (!open) return null;

    return (
        <div className="wallet-modal-overlay" onClick={handleClose}>
            <div
                className="wallet-modal"
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="wallet-modal-title">Nova Carteira</h2>

                <form onSubmit={handleSubmit}>
                    <div className="wallet-group">
                        <label>Nome da Carteira</label>
                        <input
                            type="text"
                            placeholder="Ex: Carteira Principal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="wallet-group">
                        <label>Descrição</label>
                        <input
                            type="text"
                            placeholder="Descrição da carteira"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {error && <p className="wallet-error">{error}</p>}

                    <div className="wallet-buttons">
                        <button
                            type="button"
                            className="wallet-cancel"
                            onClick={handleClose}
                        >
                            Cancelar
                        </button>

                        <button type="submit" className="wallet-create">
                            Criar Carteira
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateWalletModal;