import { useState } from "react";
import Header from "../../components/Global/Header/Header";
import Footer from "../../components/Global/Footer/Footer";
import { categoryMock } from "../../mocks/categoryMock";
import "./Categories.css";

function Categories() {

    const [categories] = useState(categoryMock);

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

                    <button className="categories-button">

                        + Nova Categoria

                    </button>

                </div>

                <section className="categories-table">

                    <table>

                        <thead>

                            <tr>

                                <th>Nome</th>
                                <th>Tipo</th>

                            </tr>

                        </thead>

                        <tbody>

                            {categories.map(category => (

                                <tr key={category.id}>

                                    <td>

                                        {category.name}

                                    </td>

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

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </section>

            </main>

            <Footer />

        </div>

    );

}

export default Categories;