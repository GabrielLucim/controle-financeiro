import React, { useEffect, useRef } from "react";
import "./DeleteConfirmModal.css";

function DeleteConfirmModal({ open, onClose, onConfirm, title, message }) {
    const modalRef = useRef(null);

    useEffect(() => {
        if (!open || !modalRef.current) return;

        const getFocusableElements = () => {
            return modalRef.current.querySelectorAll(
                'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
                onClose();
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
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="delete-modal-overlay" onClick={onClose}>
            <div
                className="delete-modal"
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
            >
                <h2>{title || "Confirmar Exclusão"}</h2>

                <p className="delete-modal-message">
                    {message || "Tem certeza que deseja excluir este item? Essa ação não poderá ser desfeita."}
                </p>

                <div className="delete-modal-buttons">
                    <button type="button" className="cancel" onClick={onClose}>
                        Cancelar
                    </button>
                    <button type="button" className="delete-danger" onClick={onConfirm}>
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmModal;