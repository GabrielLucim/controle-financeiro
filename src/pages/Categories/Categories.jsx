import { useState } from "react";
import Header from "../../components/Global/Header/Header";
import Footer from "../../components/Global/Footer/Footer";
import CreateCategoryModal from "../../components/Category/CreateCategoryModal";
import { categoryMock } from "../../mocks/categoryMock";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./Categories.css";

function Categories() {

    const [categories, setCategories] = useState(categoryMock);

    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const handleCreate = (category) => {

        const alreadyExists = categories.some(item =>
            item.name.trim().toLowerCase() === category.name.trim().toLowerCase() &&
            item.type === category.type &&
            item.id !== editingCategory?.id
        );

        if (alreadyExists) {

            alert("Já existe uma categoria com esse nome.");

            return;

        }

        if (editingCategory) {

            setCategories(prev =>
                prev.map(item =>
                    item.id === editingCategory.id
                        ? {
                            ...item,
                            name: category.name,
                            type: category.type
                        }
                        : item
                )
            );

        } else {

            setCategories(prev => [
                ...prev,
                {
                    id: Date.now(),
                    name: category.name,
                    type: category.type
                }
            ]);

        }

        setEditingCategory(null);
        setShowModal(false);

    };

    const handleEdit = (category) => {

        setEditingCategory(category);
        setShowModal(true);

    };

    const handleDelete = (id) => {

        if (!window.confirm("Deseja realmente excluir esta categoria?")) {

            return;

        }

        setCategories(prev =>
            prev.filter(category => category.id !== id)
        );

    };

    return (

        <div className="categories-page">

            <Header />

            <main className="categories-content">

                <div className="categories-header">

                    <div>

                        <h1 className="categories-title">
                            Categorias
                        </h1>

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
                                <th>Tipo</th>
                                <th>Ações</th>

                            </tr>

                        </thead>

                        <tbody>

                            {categories.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="3"
                                        className="categories-empty-table"
                                    >
                                        Nenhuma categoria cadastrada.
                                    </td>

                                </tr>

                            ) : (

                                categories.map(category => (

                                    <tr key={category.id}>

                                        <td>{category.name}</td>

                                        <td>

                                            <span
                                                className={
                                                    category.type === "income"
                                                        ? "badge-income"
                                                        : "badge-expense"
                                                }
                                            >
                                                {category.type === "income"
                                                    ? "Receita"
                                                    : "Despesa"}
                                            </span>

                                        </td>

                                        <td className="categories-actions">

                                            <button
                                                className="edit-button"
                                                onClick={() => handleEdit(category)}
                                            >
                                                <FaEdit />
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() => handleDelete(category.id)}
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
                onSave={handleCreate}
                editingCategory={editingCategory}
            />

            <Footer />

        </div>

    );

}

export default Categories;