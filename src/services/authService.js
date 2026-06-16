const KEY_USERS = "@FinControl:users";

const initMockUsers = () => {
    const users = localStorage.getItem(KEY_USERS);
    if (!users) {
        const defaultUsers = [
            { name: "Administrador", email: "admin", password: "admin123" },
            { name: "Usuário Teste", email: "teste@fincontrol.com", password: "123456" }
        ];
        localStorage.setItem(KEY_USERS, JSON.stringify(defaultUsers));
    }
};

initMockUsers();

export const authService = {
    getUsers: () => {
        return JSON.parse(localStorage.getItem(KEY_USERS)) || [];
    },

    saveUsers: (users) => {
        localStorage.setItem(KEY_USERS, JSON.stringify(users));
    },

    register: async (name, email, password) => {
        const users = authService.getUsers();

        const emailExists = users.some(u => u.email === email);
        if (emailExists) {
            throw new Error("Este e-mail já está cadastrado.");
        }

        const newUser = { name, email, password };
        users.push(newUser);
        authService.saveUsers(users);

        return { success: true };
    }
};