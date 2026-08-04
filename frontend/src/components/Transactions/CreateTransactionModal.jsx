import React, { useEffect, useRef, useState } from "react";
import "./CreateTransactionModal.css";

function CreateTransactionModal({
    open,
    onClose,
    onSave,
    wallets = [],
    categories = [],
    editingTransaction
}) {
    const [walletId, setWalletId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("EXPENSE");
    const [value, setValue] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [error, setError] = useState("");

    const modalRef = useRef(null);

    const resetFields = () => {
        setWalletId("");
        setCategoryId("");
        setDescription("");
        setType("EXPENSE");
        setValue("");
        setDate(new Date().toISOString().split("T")[0]);
        setError("");
    };

    useEffect(() => {
        if (!open) return;

        if (editingTransaction) {
            setWalletId(editingTransaction.walletId || "");
            setCategoryId(editingTransaction.categoryId || "");
            setDescription(editingTransaction.description || "");
            setType(editingTransaction.type || "EXPENSE");
            setValue(editingTransaction.amount || editingTransaction.value || "");
            setDate(editingTransaction.date || new Date().toISOString().split("T")[0]);
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

        if (!categoryId) {
            setError("Selecione uma categoria.");
            return;
        }

        if (!value || Number(value) <= 0) {
            setError("Informe um valor válido maior que zero.");
            return;
        }

        onSave({
            walletId: Number(walletId),
            categoryId: Number(categoryId),
            description: description.trim(),
            type: type.toUpperCase(),
            amount: Number(value),
            date: date
        });

        resetFields();
    };

    if (!open) return null;

    return (
        <div className="transaction-modal-overlay" onClick={handleClose}>
            <div
                className="transaction-modal"
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
            >
                <h2>{editingTransaction ? "Editar Transação" : "Nova Transação"}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="transaction-group">
                        <label>Carteira</label>
                        <select
                            value={walletId}
                            onChange={(e) => setWalletId(e.target.value)}
                        >
                            <option value="">Selecione uma carteira</option>
                            {wallets.map(w => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="transaction-group">
                        <label>Descrição</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ex: Supermercado"
                        />
                    </div>

                    <div className="transaction-group">
                        <label>Categoria</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">Selecione uma categoria</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="transaction-group">
                        <label>Tipo</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="INCOME">Receita</option>
                            <option value="EXPENSE">Despesa</option>
                        </select>
                    </div>

                    <div className="transaction-group">
                        <label>Valor (R$)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="transaction-group">
                        <label>Data</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    {error && <p className="transaction-error">{error}</p>}

                    <div className="transaction-buttons">
                        <button type="button" className="cancel" onClick={handleClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="create">
                            {editingTransaction ? "Salvar Alterações" : "Criar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateTransactionModal;