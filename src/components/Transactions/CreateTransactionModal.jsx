import React, { useState } from "react";
import "./CreateTransactionModal.css";

function CreateTransactionModal({
    open,
    onClose,
    onCreate,
    wallets
}) {

    const [walletId, setWalletId] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("expense");
    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    if (!open) return null;

    const resetFields = () => {
        setWalletId("");
        setDescription("");
        setCategory("");
        setType("expense");
        setValue("");
        setError("");
    };

    const handleClose = () => {
        resetFields();
        onClose();
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!walletId) {
            setError("Selecione uma carteira.");
            return;
        }

        if (!description.trim()) {
            setError("Informe a descrição.");
            return;
        }

        if (!category.trim()) {
            setError("Informe a categoria.");
            return;
        }

        if (!value || Number(value) <= 0) {
            setError("Informe um valor válido.");
            return;
        }

        onCreate({
            id: Date.now(),
            walletId: Number(walletId),
            description,
            category,
            type,
            value: Number(value),
            date: new Date().toLocaleDateString("pt-BR")
        });

        resetFields();
        onClose();
    };

    return (

        <div className="transaction-modal-overlay">

            <div className="transaction-modal">

                <h2>Nova Transação</h2>

                <form onSubmit={handleSubmit}>

                    <div className="transaction-group">

                        <label>Carteira</label>

                        <select
                            value={walletId}
                            onChange={(e) => setWalletId(e.target.value)}
                        >

                            <option value="">
                                Selecione
                            </option>

                            {wallets.map(wallet => (

                                <option
                                    key={wallet.id}
                                    value={wallet.id}
                                >
                                    {wallet.name}
                                </option>

                            ))}

                        </select>

                    </div>

                    <div className="transaction-group">

                        <label>Descrição</label>

                        <input
                            type="text"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                        />

                    </div>

                    <div className="transaction-group">

                        <label>Categoria</label>

                        <input
                            type="text"
                            value={category}
                            onChange={(e) =>
                                setCategory(e.target.value)
                            }
                        />

                    </div>

                    <div className="transaction-group">

                        <label>Tipo</label>

                        <select
                            value={type}
                            onChange={(e) =>
                                setType(e.target.value)
                            }
                        >
                            <option value="income">
                                Receita
                            </option>

                            <option value="expense">
                                Despesa
                            </option>

                        </select>

                    </div>

                    <div className="transaction-group">

                        <label>Valor</label>

                        <input
                            type="number"
                            step="0.01"
                            value={value}
                            onChange={(e) =>
                                setValue(e.target.value)
                            }
                        />

                    </div>

                    {error && (
                        <p className="transaction-error">
                            {error}
                        </p>
                    )}

                    <div className="transaction-buttons">

                        <button
                            type="button"
                            className="cancel"
                            onClick={handleClose}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="create"
                        >
                            Criar
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default CreateTransactionModal;