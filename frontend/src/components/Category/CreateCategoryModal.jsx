import React, { useEffect, useRef, useState } from "react";
import "./CreateCategoryModal.css";

function CreateCategoryModal({ open, onClose, onSave, editingCategory }) {
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const modalRef = useRef(null);

    useEffect(() => {
        if (!open) return;

        if (editingCategory) {
            setName(editingCategory.name || "");
        } else {
            setName("");
        }

        setError("");
    }, [editingCategory, open]);

    const handleClose = () => {
        setName("");
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
        });
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
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

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