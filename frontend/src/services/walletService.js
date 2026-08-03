import api from "./api";

export const walletService = {

    async create(wallet) {

        const response = await api.post("/wallets", wallet);

        return response.data;

    },

    async findAll() {

        const response = await api.get("/wallets");

        return response.data;

    }

};