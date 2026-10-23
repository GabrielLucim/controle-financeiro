import api from "./api";

export const categoryService = {
    async getAll(walletId) {
        const response = walletId
            ? await api.get("/categories", { params: { walletId } })
            : await api.get("/categories");

        return response.data;
    },

    async create(data) {
        const response = await api.post("/categories", data);
        return response.data;
    },

    async update(id, data) {
        const response = await api.put(`/categories/${id}`, data);
        return response.data;
    },

    async delete(id) {
        await api.delete(`/categories/${id}`);
    }
};