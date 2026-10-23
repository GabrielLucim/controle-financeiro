import React, { useEffect, useRef, useState } from "react";
import { categoryService } from "../../services/categoryService";
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
    const [availableCategories, setAvailableCategories] = useState(categories);
    const [categoryLoading, setCategoryLoading] = useState(false);

    const modalRef = useRef(null);

    const resetFields = () => {
        setWalletId("");
        setCategoryId("");
        setDescription("");
        setType("EXPENSE");
        setValue("");
        setDate(new Date().toISOString().split("T")[0]);
        setError("");
        setAvailableCategories(categories);
    };

    useEffect(() => {
        if (!open) return;

        setError("");

        if (editingTransaction) {
            setWalletId(String(editingTransaction.walletId || ""));
            setCategoryId(String(editingTransaction.categoryId || ""));
            setDescription(editingTransaction.description || "");
            setType(editingTransaction.type?.toUpperCase() || "EXPENSE");
            setValue(editingTransaction.amount || editingTransaction.value || "");
            setDate(
                editingTransaction.date ||
                new Date().toISOString().split("T")[0]
            );
        } else {
            resetFields();
        }
    }, [editingTransaction, open]);

    useEffect(() => {
        if (!open || !walletId) {
            setAvailableCategories(categories);
            setCategoryLoading(false);
            return;
        }

        let cancelled = false;

        async function loadWalletCategories() {
            try {
                setCategoryLoading(true);
                setError("");

                const data = await categoryService.getAll(walletId);

                if (!cancelled) {
                    setAvailableCategories(data);
                }
            } catch (err) {
                console.error(
                    "Erro ao carregar categorias da carteira:",
                    err
                );

                if (!cancelled) {
                    setAvailableCategories([]);
                    setError(
                        "Não foi possível carregar as categorias desta carteira."
                    );
                }
            } finally {
                if (!cancelled) {
                    setCategoryLoading(false);
                }
            }
        }

        loadWalletCategories();

        return () => {
            cancelled = true;
        };
    }, [open, walletId]);

    const handleWalletChange = (nextWalletId) => {
        setWalletId(nextWalletId);
        setCategoryId("");
        setError("");
    };

    const handleClose = () => {
        resetFields();
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (categoryLoading) {
            setError("Aguarde o carregamento das categorias.");
            return;
        }

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
            date
        });

        resetFields();
    };

    useEffect(() => {
        if (!open || !modalRef.current) return;

        const getFocusableElements = () => {
            return modalRef.current.querySelectorAll(
                'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
        };

        const focusableElements = getFocusableElements();

        if (focusableElements.length > 0) {
            setTimeout(() => {
                focusableElements[0].focus();
            }, 50);
        }

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                handleClose();
                return;
            }

            if (e.key === "Tab") {
                const currentFocusable = getFocusableElements();

                if (currentFocusable.length === 0) return;

                const first = currentFocusable[0];
                const last = currentFocusable[currentFocusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (
                    !e.shiftKey &&
                    document.activeElement === last
                ) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    if (!open) return null;

    const categoryExists = availableCategories.some(
        (category) => String(category.id) === String(categoryId)
    );

    const keepingExistingCategory =
        editingTransaction
        && Number(walletId) === Number(editingTransaction.walletId)
        && editingTransaction.categoryId
        && String(editingTransaction.categoryId) === String(categoryId)
        && !categoryExists;

    const categoriesForSelect = keepingExistingCategory
        ? [
            {
                id: editingTransaction.categoryId,
                name: editingTransaction.categoryName || "Categoria atual"
            },
            ...availableCategories
        ]
        : availableCategories;

    return (
        <div className="transaction-modal-overlay" onClick={handleClose}>
            <div
                className="transaction-modal"
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
            >
                <h2>
                    {editingTransaction ? "Editar Transação" : "Nova Transação"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="transaction-group">
                        <label htmlFor="transaction-wallet">Carteira</label>

                        <select
                            id="transaction-wallet"
                            value={walletId}
                            onChange={(e) => handleWalletChange(e.target.value)}
                            required
                        >
                            <option value="">Selecione uma carteira</option>

                            {wallets.map((wallet) => (
                                <option key={wallet.id} value={wallet.id}>
                                    {wallet.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="transaction-group">
                        <label htmlFor="transaction-description">Descrição</label>

                        <input
                            id="transaction-description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ex: Supermercado"
                            maxLength={150}
                            required
                        />
                    </div>

                    <div className="transaction-group">
                        <label htmlFor="transaction-category">Categoria</label>

                        <select
                            id="transaction-category"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            disabled={!walletId || categoryLoading}
                            required
                        >
                            <option value="">
                                {categoryLoading
                                    ? "Carregando categorias..."
                                    : "Selecione uma categoria"}
                            </option>

                            {categoriesForSelect.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="transaction-group">
                        <label htmlFor="transaction-type">Tipo</label>

                        <select
                            id="transaction-type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="INCOME">Receita</option>
                            <option value="EXPENSE">Despesa</option>
                        </select>
                    </div>

                    <div className="transaction-group">
                        <label htmlFor="transaction-value">Valor (R$)</label>

                        <input
                            id="transaction-value"
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div className="transaction-group">
                        <label htmlFor="transaction-date">Data</label>

                        <input
                            id="transaction-date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p className="transaction-error" role="alert">
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
                            disabled={categoryLoading}
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