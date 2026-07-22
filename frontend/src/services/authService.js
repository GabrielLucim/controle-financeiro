const KEY_USERS = "@FinControl:users";

const initMockUsers = () => {
    const users = localStorage.getItem(KEY_USERS);

    if (!users) {
        const defaultUsers = [
            {
                name: "Administrador",
                email: "admin",
                password: "admin123"
            }
        ];

        localStorage.setItem(
            KEY_USERS,
            JSON.stringify(defaultUsers)
        );
    }
};

initMockUsers();

export const authService = {
    getUsers: () => {
        return JSON.parse(
            localStorage.getItem(KEY_USERS)
        ) || [];
    },

    saveUsers: (users) => {
        localStorage.setItem(
            KEY_USERS,
            JSON.stringify(users)
        );
    },

    register: async (name, email, password) => {
        const users = authService.getUsers();

        const emailExists = users.some(
            user => user.email === email
        );

        if (emailExists) {
            throw new Error("Este e-mail já está cadastrado.");
        }

        const newUser = {
            name,
            email,
            password
        };

        users.push(newUser);

        authService.saveUsers(users);

        return newUser;
    },

    login: async (email, password) => {
        const users = authService.getUsers();

        const user = users.find(
            u =>
                u.email === email &&
                u.password === password
        );

        if (!user) {
            throw new Error("E-mail ou senha inválidos.");
        }

        return {
            user: {
                name: user.name,
                email: user.email
            },
            token: "mock-token"
        };
    },

    changePassword: async (
        email,
        currentPassword,
        newPassword
    ) => {
        const users = authService.getUsers();

        const index = users.findIndex(
            user => user.email === email
        );

        if (index === -1) {
            throw new Error("Usuário não encontrado.");
        }

        if (
            users[index].password !== currentPassword
        ) {
            throw new Error("Senha atual incorreta.");
        }

        users[index].password = newPassword;

        authService.saveUsers(users);

        return true;
    }
};