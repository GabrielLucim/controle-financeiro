import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./AddWalletMemberModal.css";

function AddWalletMemberModal({ open, onClose, onAdd }) {
    const modalRef = useRef(null);

    const [email, setEmail] = useState("");
    const [role, setRole] = useState("EDITOR");
    const [emailError, setEmailError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!open || !modalRef.current) return;

        const focusable = modalRef.current.querySelectorAll(
            'button,input,select,textarea,[tabindex]:not([tabindex="-1"])'
        );

        if (focusable.length > 0) {
            focusable[0].focus();
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
                return;
            }

            if (event.key !== "Tab") return;

            const currentFocusable = modalRef.current.querySelectorAll(
                'button,input,select,textarea,[tabindex]:not([tabindex="-1"])'
            );

            if (currentFocusable.length === 0) return;

            const first = currentFocusable[0];
            const last = currentFocusable[currentFocusable.length - 1];

            if (event.shiftKey) {
                if (document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                }
            } else if (document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    useEffect(() => {
        if (!open) {
            setEmail("");
            setRole("EDITOR");
            setEmailError("");
            setSubmitting(false);
        }
    }, [open]);

    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!value.trim()) {
            return "Informe o e-mail.";
        }

        if (!emailRegex.test(value.trim())) {
            return "Informe um e-mail válido.";
        }

        return "";
    };

    const handleEmailChange = (event) => {
        const value = event.target.value;

        setEmail(value);

        if (emailError) {
            setEmailError(validateEmail(value));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationError = validateEmail(email);

        if (validationError) {
            setEmailError(validationError);
            return;
        }

        try {
            setSubmitting(true);

            await onAdd({
                email: email.trim(),
                role
            });

            setEmail("");
            setRole("EDITOR");
            setEmailError("");

            onClose();
        } catch (error) {
            console.error("Erro ao adicionar membro:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!open) return null;

    return createPortal(
        <div
            className="add-wallet-member-modal-overlay"
            onClick={onClose}
        >
            <div
                className="add-wallet-member-modal"
                ref={modalRef}
                onClick={(event) => event.stopPropagation()}
            >
                <div className="add-wallet-member-header">
                    <h2 className="add-wallet-member-title">
                        Adicionar membro
                    </h2>

                    <button
                        type="button"
                        className="add-wallet-member-close"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="add-wallet-member-content">
                        <div className="add-wallet-member-field">
                            <label htmlFor="wallet-member-email">
                                E-mail
                            </label>

                            <input
                                id="wallet-member-email"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="usuario@email.com"
                                disabled={submitting}
                                aria-invalid={Boolean(emailError)}
                                aria-describedby={
                                    emailError
                                        ? "wallet-member-email-error"
                                        : undefined
                                }
                            />

                            {emailError && (
                                <span
                                    id="wallet-member-email-error"
                                    className="add-wallet-member-error"
                                >
                                    {emailError}
                                </span>
                            )}
                        </div>

                        <div className="add-wallet-member-field">
                            <label htmlFor="wallet-member-role">
                                Permissão
                            </label>

                            <select
                                id="wallet-member-role"
                                value={role}
                                onChange={(event) =>
                                    setRole(event.target.value)
                                }
                                disabled={submitting}
                            >
                                <option value="EDITOR">
                                    Editor
                                </option>

                                <option value="VISUALIZADOR">
                                    Visualizador
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="add-wallet-member-footer">
                        <button
                            type="submit"
                            className="add-wallet-member-submit"
                            disabled={submitting}
                        >
                            {submitting ? "Adicionando..." : "Adicionar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

export default AddWalletMemberModal;