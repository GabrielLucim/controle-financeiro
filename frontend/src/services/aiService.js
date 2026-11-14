import api from "./api";

export const aiService = {
    async getFinancialAnalysis(walletId, year, month) {
        const response = await api.post("/ai/financial-analysis", {
            walletId,
            year,
            month
        });

        return response.data;
    }
};
