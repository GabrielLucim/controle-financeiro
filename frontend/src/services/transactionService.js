import api from "./api";

export const transactionService = {

    async getAll() {
        const response = await api.get("/transactions");
        return response.data;
    },

    async create(transaction) {
        const response = await api.post("/transactions", transaction);
        return response.data;
    },

    async update(id, transaction) {
        const response = await api.put(`/transactions/${id}`, transaction);
        return response.data;
    },

    async delete(id) {
        await api.delete(`/transactions/${id}`);
    }

};