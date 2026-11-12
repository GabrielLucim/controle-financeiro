import React, { useEffect, useMemo, useState } from "react";
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip
} from "recharts";
import Header from "../../components/Global/Header/Header";
import Footer from "../../components/Global/Footer/Footer";
import { reportService } from "../../services/reportService";
import { walletService } from "../../services/walletService";
import "./Reports.css";

const MONTHS = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" }
];

const CHART_COLORS = [
    "#6366f1",
    "#22c55e",
    "#f59e0b",
    "#06b6d4",
    "#ec4899",
    "#a78bfa",
    "#f97316",
    "#84cc16"
];

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

function formatCurrency(value) {
    return currencyFormatter.format(Number(value) || 0);
}

function formatDate(date) {
    if (!date) return "—";

    const [year, month, day] = date.split("-");

    if (!year || !month || !day) return date;

    return `${day}/${month}/${year}`;
}

function CategoryChart({ title, categories, emptyMessage }) {
    return (
        <section className="reports-chart-card">
            <div className="reports-section-heading">
                <h2>{title}</h2>
            </div>

            {categories.length === 0 ? (
                <div className="reports-chart-empty">
                    {emptyMessage}
                </div>
            ) : (
                <div className="reports-chart-container">
                    <ResponsiveContainer width="100%" height={290}>
                        <PieChart>
                            <Pie
                                data={categories}
                                dataKey="totalAmount"
                                nameKey="categoryName"
                                cx="50%"
                                cy="46%"
                                innerRadius={58}
                                outerRadius={96}
                                paddingAngle={2}
                            >
                                {categories.map((category, index) => (
                                    <Cell
                                        key={`${category.categoryId}-${category.type}`}
                                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip
                                formatter={(value) => formatCurrency(value)}
                                contentStyle={{
                                    backgroundColor: "#222630",
                                    border: "1px solid #374151",
                                    borderRadius: "10px",
                                    color: "#ffffff"
                                }}
                                itemStyle={{ color: "#ffffff" }}
                            />

                            <Legend
                                verticalAlign="bottom"
                                formatter={(value) => (
                                    <span className="reports-chart-legend">
                                        {value}
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

            {categories.length > 0 && (
                <div className="reports-category-list">
                    {categories.map((category) => (
                        <div
                            className="reports-category-row"
                            key={`${category.categoryId}-${category.type}`}
                        >
                            <span>{category.categoryName}</span>

                            <strong>
                                {formatCurrency(category.totalAmount)}
                            </strong>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

function Reports() {
    const today = new Date();

    const [wallets, setWallets] = useState([]);
    const [selectedWalletId, setSelectedWalletId] = useState("");
    const [selectedMonth, setSelectedMonth] = useState(String(today.getMonth() + 1));
    const [selectedYear, setSelectedYear] = useState(String(today.getFullYear()));
    const [report, setReport] = useState(null);
    const [loadingWallets, setLoadingWallets] = useState(true);
    const [loadingReport, setLoadingReport] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let isActive = true;

        const loadWallets = async () => {
            try {
                const data = await walletService.findAll();

                if (isActive) {
                    setWallets(data);
                }
            } catch (requestError) {
                console.error("Erro ao carregar carteiras para o relatório:", requestError);

                if (isActive) {
                    setError(
                        requestError.response?.data?.message ||
                        "Não foi possível carregar suas carteiras."
                    );
                }
            } finally {
                if (isActive) {
                    setLoadingWallets(false);
                }
            }
        };

        loadWallets();

        return () => {
            isActive = false;
        };
    }, []);

    const incomeCategories = useMemo(
        () => (report?.categoryTotals || []).filter(
            (category) => category.type === "INCOME"
        ),
        [report]
    );

    const expenseCategories = useMemo(
        () => (report?.categoryTotals || []).filter(
            (category) => category.type === "EXPENSE"
        ),
        [report]
    );

    const selectedMonthName = MONTHS.find(
        (month) => month.value === Number(selectedMonth)
    )?.label;

    const handleGenerateReport = async (event) => {
        event.preventDefault();

        const year = Number(selectedYear);
        const month = Number(selectedMonth);

        if (!selectedWalletId) {
            setError("Selecione uma carteira para gerar o relatório.");
            return;
        }

        if (!Number.isInteger(year) || year < 1 || year > 9999) {
            setError("Informe um ano válido.");
            return;
        }

        if (!Number.isInteger(month) || month < 1 || month > 12) {
            setError("Selecione um mês válido.");
            return;
        }

        try {
            setLoadingReport(true);
            setError("");
            setReport(null);

            const data = await reportService.getMonthly(
                selectedWalletId,
                year,
                month
            );

            setReport(data);
        } catch (requestError) {
            console.error("Erro ao gerar relatório mensal:", requestError);

            setError(
                requestError.response?.data?.message ||
                "Não foi possível gerar o relatório. Tente novamente."
            );
        } finally {
            setLoadingReport(false);
        }
    };

    return (
        <div className="reports-page">
            <Header />

            <main className="reports-content">
                <div className="reports-header">
                    <div>
                        <h1 className="reports-title">Relatórios</h1>

                        <p className="reports-subtitle">
                            Acompanhe receitas, despesas e movimentações por período.
                        </p>
                    </div>
                </div>

                <form
                    className="reports-filters"
                    onSubmit={handleGenerateReport}
                >
                    <div className="reports-filter-field reports-wallet-filter">
                        <label htmlFor="report-wallet">
                            Carteira
                        </label>

                        <select
                            id="report-wallet"
                            value={selectedWalletId}
                            onChange={(event) => {
                                setSelectedWalletId(event.target.value);
                                setReport(null);
                                setError("");
                            }}
                            disabled={loadingWallets || wallets.length === 0}
                            required
                        >
                            <option value="">
                                {loadingWallets
                                    ? "Carregando carteiras..."
                                    : wallets.length === 0
                                        ? "Nenhuma carteira disponível"
                                        : "Selecione uma carteira"}
                            </option>

                            {wallets.map((wallet) => (
                                <option key={wallet.id} value={wallet.id}>
                                    {wallet.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="reports-filter-field">
                        <label htmlFor="report-month">
                            Mês
                        </label>

                        <select
                            id="report-month"
                            value={selectedMonth}
                            onChange={(event) => {
                                setSelectedMonth(event.target.value);
                                setReport(null);
                                setError("");
                            }}
                        >
                            {MONTHS.map((month) => (
                                <option
                                    key={month.value}
                                    value={month.value}
                                >
                                    {month.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="reports-filter-field reports-year-filter">
                        <label htmlFor="report-year">
                            Ano
                        </label>

                        <input
                            id="report-year"
                            type="number"
                            min="1"
                            max="9999"
                            step="1"
                            value={selectedYear}
                            onChange={(event) => {
                                setSelectedYear(event.target.value);
                                setReport(null);
                                setError("");
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="reports-generate-button"
                        disabled={loadingWallets || wallets.length === 0 || loadingReport}
                    >
                        {loadingReport ? "Gerando..." : "Gerar relatório"}
                    </button>
                </form>

                {error && (
                    <div className="reports-alert" role="alert">
                        {error}
                    </div>
                )}

                {!report && !loadingReport && !error && (
                    <div className="reports-placeholder">
                        <h2>Gere seu relatório mensal</h2>

                        <p>
                            Selecione uma carteira, um mês e um ano para visualizar
                            o resumo financeiro e as transações do período.
                        </p>
                    </div>
                )}

                {loadingReport && (
                    <div className="reports-placeholder" role="status">
                        Gerando relatório...
                    </div>
                )}

                {report && !loadingReport && (
                    <>
                        <div className="reports-period-heading">
                            <div>
                                <h2>{report.walletName}</h2>

                                <p>
                                    {selectedMonthName} de {report.year} ·
                                    Período de {formatDate(report.periodStart)} a {formatDate(report.periodEnd)}
                                </p>
                            </div>

                            <span className="reports-transaction-count">
                                {report.transactionCount}{" "}
                                {report.transactionCount === 1
                                    ? "transação"
                                    : "transações"}
                            </span>
                        </div>

                        <section className="reports-summary-grid">
                            <article className="reports-summary-card">
                                <span className="reports-summary-label">
                                    Receitas
                                </span>

                                <strong className="reports-summary-value income">
                                    {formatCurrency(report.totalIncome)}
                                </strong>
                            </article>

                            <article className="reports-summary-card">
                                <span className="reports-summary-label">
                                    Despesas
                                </span>

                                <strong className="reports-summary-value expense">
                                    {formatCurrency(report.totalExpense)}
                                </strong>
                            </article>

                            <article className="reports-summary-card">
                                <span className="reports-summary-label">
                                    Saldo do período
                                </span>

                                <strong
                                    className={`reports-summary-value ${Number(report.balance) >= 0
                                            ? "income"
                                            : "expense"
                                        }`}
                                >
                                    {formatCurrency(report.balance)}
                                </strong>
                            </article>
                        </section>

                        <section className="reports-charts-grid">
                            <CategoryChart
                                title="Receitas por categoria"
                                categories={incomeCategories}
                                emptyMessage="Não há receitas neste período."
                            />

                            <CategoryChart
                                title="Despesas por categoria"
                                categories={expenseCategories}
                                emptyMessage="Não há despesas neste período."
                            />
                        </section>

                        <section className="reports-transactions-section">
                            <div className="reports-section-heading">
                                <div>
                                    <h2>Extrato do período</h2>

                                    <p>
                                        Movimentações registradas na carteira selecionada.
                                    </p>
                                </div>
                            </div>

                            <div className="reports-table-wrapper">
                                <table className="reports-table">
                                    <thead>
                                        <tr>
                                            <th>Data</th>
                                            <th>Descrição</th>
                                            <th>Categoria</th>
                                            <th>Tipo</th>
                                            <th>Valor</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {report.transactions.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="reports-empty-table"
                                                >
                                                    Nenhuma transação encontrada neste período.
                                                </td>
                                            </tr>
                                        ) : (
                                            report.transactions.map((transaction) => {
                                                const isIncome = transaction.type === "INCOME";

                                                return (
                                                    <tr key={transaction.id}>
                                                        <td>
                                                            {formatDate(transaction.date)}
                                                        </td>

                                                        <td>
                                                            {transaction.description}
                                                        </td>

                                                        <td>
                                                            {transaction.categoryName || "Sem categoria"}
                                                        </td>

                                                        <td>
                                                            <span
                                                                className={`reports-type-badge ${isIncome ? "income" : "expense"
                                                                    }`}
                                                            >
                                                                {isIncome ? "Receita" : "Despesa"}
                                                            </span>
                                                        </td>

                                                        <td
                                                            className={`reports-transaction-value ${isIncome ? "income" : "expense"
                                                                }`}
                                                        >
                                                            {isIncome ? "+ " : "- "}
                                                            {formatCurrency(transaction.amount)}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default Reports;