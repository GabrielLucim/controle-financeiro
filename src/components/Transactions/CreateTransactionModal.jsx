import React, { useEffect, useRef, useState } from "react";
import "./CreateTransactionModal.css";

function CreateTransactionModal({
    open,
    onClose,
    onSave,
    wallets,
    editingTransaction
}) {

    const [walletId, setWalletId] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("expense");
    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    const modalRef = useRef(null);

    const resetFields = () => {

        setWalletId("");
        setDescription("");
        setCategory("");
        setType("expense");
        setValue("");
        setError("");

    };

    useEffect(() => {

        if (!open) return;

        if (editingTransaction) {

            setWalletId(editingTransaction.walletId);
            setDescription(editingTransaction.description);
            setCategory(editingTransaction.category);
            setType(editingTransaction.type);
            setValue(editingTransaction.value);

        } else {

            resetFields();

        }

    }, [editingTransaction, open]);

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

            setError("Informe uma descrição.");
            return;

        }

        if (!category.trim()) {

            setError("Informe uma categoria.");
            return;

        }

        if (!value || Number(value) <= 0) {

            setError("Informe um valor válido.");
            return;

        }

        onSave({

            id: editingTransaction
                ? editingTransaction.id
                : Date.now(),

            walletId: Number(walletId),

            description,

            category,

            type,

            value: Number(value),

            date: editingTransaction
                ? editingTransaction.date
                : new Date().toLocaleDateString("pt-BR")

        });

        resetFields();

        onClose();

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

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () =>
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

    }, [open]);

    if (!open) return null;

    return (

        <div
            className="transaction-modal-overlay"
            onClick={handleClose}
        >

            <div
                className="transaction-modal"
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
            >

                <h2>

                    {editingTransaction
                        ? "Editar Transação"
                        : "Nova Transação"}

                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="transaction-group">

                        <label>

                            Carteira

                        </label>

                        <select
                            value={walletId}
                            onChange={(e) =>
                                setWalletId(e.target.value)
                            }
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

                        <label>

                            Descrição

                        </label>

                        <input
                            type="text"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                        />

                    </div>

                    <div className="transaction-group">

                        <label>

                            Categoria

                        </label>

                        <input
                            type="text"
                            value={category}
                            onChange={(e) =>
                                setCategory(e.target.value)
                            }
                        />

                    </div>

                    <div className="transaction-group">

                        <label>

                            Tipo

                        </label>

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

                        <label>

                            Valor

                        </label>

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

                            {editingTransaction
                                ? "Salvar Alterações"
                                : "Criar"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default CreateTransactionModal;