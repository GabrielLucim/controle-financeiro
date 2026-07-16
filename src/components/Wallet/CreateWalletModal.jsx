import React, { useState } from "react";
import "./CreateWalletModal.css";

function CreateWalletModal({ open, onClose, onCreate }) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [balance, setBalance] = useState("");
    const [members, setMembers] = useState(1);

    const [error, setError] = useState("");

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
                    : parseFloat(
                        balance
                            .toString()
                            .replace(",", ".")
                    ),
            members: Number(members)
        });

        setName("");
        setDescription("");
        setBalance("");
        setMembers(1);
        setError("");

        onClose();
    };

    const handleClose = () => {
        setName("");
        setDescription("");
        setBalance("");
        setMembers(1);
        setError("");

        onClose();
    };

    return (
        <div className="wallet-modal-overlay">

            <div className="wallet-modal">

                <h2 className="wallet-modal-title">
                    Nova Carteira
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="wallet-group">

                        <label>Nome da Carteira</label>

                        <input
                            type="text"
                            placeholder="Ex.: Carteira Principal"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                        />

                    </div>

                    <div className="wallet-group">

                        <label>Descrição</label>

                        <input
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