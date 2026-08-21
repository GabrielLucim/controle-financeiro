import React, { useEffect, useState } from "react";
import Header from "../../components/Global/Header/Header";
import Footer from "../../components/Global/Footer/Footer";
import CreateCategoryModal from "../../components/Category/CreateCategoryModal";
import { categoryService } from "../../services/categoryService";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./Categories.css";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            setLoading(true);
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async (categoryData) => {
        try {
            if (editingCategory) {
                await categoryService.update(editingCategory.id, categoryData);
            } else {
                await categoryService.create(categoryData);
            }
            await loadCategories();
            setShowModal(false);
            setEditingCategory(null);
        } catch (error) {
            console.error("Erro ao salvar categoria:", error);
            alert(error.response?.data?.message || "Erro ao salvar categoria.");
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Deseja realmente excluir esta categoria?")) {
            return;
        }

        try {
            await categoryService.delete(id);
            await loadCategories();
        } catch (error) {
            console.error("Erro ao excluir categoria:", error);
            alert("Erro ao excluir categoria. Verifique se ela possui transações vinculadas.");
        }
    };

    return (
        <div className="categories-page">
            <Header />
            <main className="categories-content">
                <div className="categories-header">
                    <div>
                        <h1 className="categories-title">Categorias</h1>
                        <p className="categories-subtitle">
                            Gerencie as categorias das suas transações.
                        </p>
                    </div>
                    <button
                        className="categories-button"
                        onClick={() => {
                            setEditingCategory(null);
                            setShowModal(true);
                        }}
                    >
                        + Nova Categoria
                    </button>
                </div>

                <section className="categories-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="2" className="categories-empty-table">
                                        Carregando categorias...
                                    </td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan="2" className="categories-empty-table">
                                        Nenhuma categoria cadastrada.
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category.id}>
                                        <td>{category.name}</td>
                                        <td className="categories-actions">
                                            <button
                                                className="edit-button"
                                                onClick={() => handleEdit(category)}
                                                title="Editar"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="delete-button"
                                                onClick={() => handleDelete(category.id)}
                                                title="Excluir"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </section>
            </main>

            <CreateCategoryModal
                open={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingCategory(null);
                }}
                onSave={handleSave}
                editingCategory={editingCategory}
            />
            <Footer />
        </div>
    );
}

export default Categories;