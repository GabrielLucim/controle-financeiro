import api from "./api";

export const walletMemberService = {

    async findAll(walletId) {
        const response = await api.get(`/wallets/${walletId}/members`);
        return response.data;
    },

    async add(walletId, member) {
        const response = await api.post(
            `/wallets/${walletId}/members`,
            member
        );
        return response.data;
    },

    async update(walletId, userId, member) {
        const response = await api.patch(
            `/wallets/${walletId}/members/${userId}`,
            member
        );
        return response.data;
    },

    async remove(walletId, userId) {
        await api.delete(`/wallets/${walletId}/members/${userId}`);
    }

};