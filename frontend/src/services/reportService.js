import api from "./api";

export const reportService = {
    async getMonthly(walletId, year, month) {
        const response = await api.get("/reports/monthly", {
            params: { walletId, year, month }
        });

        return response.data;
    }
};