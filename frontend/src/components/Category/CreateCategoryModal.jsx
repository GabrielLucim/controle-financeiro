import React, { useEffect, useRef, useState } from "react";
import "./CreateCategoryModal.css";

function CreateCategoryModal({ open, onClose, onSave, editingCategory }) {
    const [name, setName] = useState("");
    const [type, setType] = useState("EXPENSE");
    const [error, setError] = useState("");

    const modalRef = useRef(null);

    useEffect(() => {
        if (!open) return;

        if (editingCategory) {
            setName(editingCategory.name);
            setType(editingCategory.type?.toUpperCase() || "EXPENSE");
        } else {
            setName("");
            setType("EXPENSE");
        }

        setError("");
    }, [editingCategory, open]);

    const handleClose = () => {
        setName("");
        setType("EXPENSE");
        setError("");
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("Informe o nome da categoria.");
            return;
        }

        onSave({
            name: name.trim(),
            type: type.toUpperCase()
        });
    };

    if (!open) return null;

    return (
        <div className="category-modal-overlay" onClick={handleClose}>
            <div
                className="category-modal"
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
            >
                <h2>{editingCategory ? "Editar Categoria" : "Nova Categoria"}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="category-group">
                        <label>Nome</label>
                        <input
                            type="text"
                            placeholder="Ex: Alimentação"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="category-group">
                        <label>Tipo</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="INCOME">Receita</option>
                            <option value="EXPENSE">Despesa</option>
                        </select>
                    </div>

                    {error && <p className="category-error">{error}</p>}

                    <div className="category-buttons">
                        <button type="button" className="cancel" onClick={handleClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="create">
                            {editingCategory ? "Salvar Alterações" : "Criar Categoria"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateCategoryModal;