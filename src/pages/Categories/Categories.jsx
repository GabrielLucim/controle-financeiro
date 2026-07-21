import Header from "../../components/Global/Header/Header";
import Footer from "../../components/Global/Footer/Footer";
import "./Categories.css";

function Categories() {

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

                </div>

            </main>

            <Footer />

        </div>

    );

}

export default Categories;