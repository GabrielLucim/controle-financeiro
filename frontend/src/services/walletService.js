import api from "./api";

export const walletService = {

    async findAll() {
        const response = await api.get("/wallets");
        return response.data;
    },

    async create(wallet) {
        const response = await api.post("/wallets", wallet);
        return response.data;
    },

    async update(id, wallet) {
        const response = await api.put(`/wallets/${id}`, wallet);
        return response.data;
    },

    async delete(id) {
        await api.delete(`/wallets/${id}`);
    }

};