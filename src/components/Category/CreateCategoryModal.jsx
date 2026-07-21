import { useEffect, useRef, useState } from "react";
import "./CreateCategoryModal.css";

function CreateCategoryModal({
    open,
    onClose,
    onSave,
    editingCategory
}) {

    const [name, setName] = useState("");
    const [type, setType] = useState("expense");
    const [error, setError] = useState("");

    const modalRef = useRef(null);

    useEffect(() => {

        if (!open) return;

        if (editingCategory) {

            setName(editingCategory.name);
            setType(editingCategory.type);

        } else {

            setName("");
            setType("expense");

        }

        setError("");

    }, [editingCategory, open]);

    useEffect(() => {

        if (!open || !modalRef.current) return;

        const focusable = modalRef.current.querySelectorAll(
            "button,input,select"
        );

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        first?.focus();

        const handleKeyDown = (e) => {

            if (e.key === "Escape") {

                onClose();
                return;

            }

            if (e.key !== "Tab") return;

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

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () =>
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

    }, [open, onClose]);

    if (!open) return null;

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!name.trim()) {

            setError("Informe o nome da categoria.");
            return;

        }

        onSave({

            id: editingCategory
                ? editingCategory.id
                : Date.now(),

            name,
            type

        });

        onClose();

    };

    return (

        <div
            className="category-modal-overlay"
            onClick={onClose}
        >

            <div
                className="category-modal"
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
            >

                <h2>

                    {editingCategory
                        ? "Editar Categoria"
                        : "Nova Categoria"}

                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="category-group">

                        <label>

                            Nome

                        </label>

                        <input
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                        />

                    </div>

                    <div className="category-group">

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

                    {error && (

                        <p className="category-error">

                            {error}

                        </p>

                    )}

                    <div className="category-buttons">

                        <button
                            type="button"
                            className="cancel"
                            onClick={onClose}
                        >

                            Cancelar

                        </button>

                        <button
                            type="submit"
                            className="create"
                        >

                            {editingCategory
                                ? "Salvar"
                                : "Criar"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default CreateCategoryModal;