export const dashboardMock = {
    summary: {
        balance: 5280.50,
        income: 7200,
        expenses: 1919.50
    },

    chart: [
        {
            name: "Receitas",
            value: 7200
        },
        {
            name: "Despesas",
            value: 1919.50
        }
    ],

    recentTransactions: [
        {
            id: 1,
            description: "Salário",
            value: 4500,
            type: "income",
            date: "01/07/2026"
        },
        {
            id: 2,
            description: "Mercado",
            value: -320.80,
            type: "expense",
            date: "03/07/2026"
        },
        {
            id: 3,
            description: "Internet",
            value: -120,
            type: "expense",
            date: "05/07/2026"
        }
    ]
};