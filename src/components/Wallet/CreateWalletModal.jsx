import React, { useState, useEffect, useRef } from "react";
import "./CreateWalletModal.css";

function CreateWalletModal({ open, onClose, onCreate }) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [balance, setBalance] = useState("");
    const [members, setMembers] = useState(1);
    const [error, setError] = useState("");

    const modalRef = useRef(null);

    const clearFields = () => {
        setName("");
        setDescription("");
        setBalance("");
        setMembers(1);
        setError("");
    };

    const handleClose = () => {
        clearFields();
        onClose();
    };

    useEffect(() => {

        if (!open) return;

        document.body.style.overflow = "hidden";

        const focusable = modalRef.current.querySelectorAll(
            "button, input, textarea, select"
        );

        if (focusable.length > 0) {
            focusable[0].focus();
        }

        const handleKeyDown = (e) => {

            if (e.key === "Escape") {
                handleClose();
                return;
            }

            if (e.key !== "Tab") return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey) {

                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }

            } else {

                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }

            }

        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {

            document.body.style.overflow = "auto";

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, [open]);

    if (!open) return null;

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!name.trim()) {
            setError("Informe o nome da carteira.");
            return;
        }

        if (members < 1) {
            setError("A carteira deve possuir pelo menos 1 membro.");
            return;
        }

        onCreate({
            id: Date.now(),
            name,
            description,
            balance:
                balance === ""
                    ? 0
                    : parseFloat(balance.toString().replace(",", ".")),
            members: Number(members)
        });

        clearFields();
        onClose();

    };

    return (

        <div
            className="wallet-modal-overlay"
            onClick={handleClose}
        >

            <div
                className="wallet-modal"
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
            >

                <h2 className="wallet-modal-title">
                    Nova Carteira
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="wallet-group">

                        <label>Nome da Carteira</label>

                        <input
                            className="modal-input"
                            type="text"
                            placeholder="Ex: Carteira Principal"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                        />

                    </div>

                    <div className="wallet-group">

                        <label>Descrição</label>

                        <input
                            className="modal-input"
                            type="text"
                            placeholder="Descrição da carteira"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                        />

                    </div>

                    <div className="wallet-group">

                        <label>Saldo Inicial</label>

                        <input
                            className="modal-input"
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            value={balance}
                            onChange={(e) =>
                                setBalance(e.target.value)
                            }
                        />

                    </div>

                    <div className="wallet-group">

                        <label>Quantidade de membros</label>

                        <input
                            className="modal-input"
                            type="number"
                            min="1"
                            value={members}
                            onChange={(e) =>
                                setMembers(e.target.value)
                            }
                        />

                    </div>

                    {error && (
                        <p className="wallet-error">
                            {error}
                        </p>
                    )}

                    <div className="wallet-buttons">

                        <button
                            type="button"
                            className="wallet-cancel"
                            onClick={handleClose}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="wallet-create"
                        >
                            Criar Carteira
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default CreateWalletModal;