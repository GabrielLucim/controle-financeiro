# FinControl - Frontend

Frontend do sistema **FinControl**, desenvolvido em **React + Vite**, para a disciplina de Engenharia de Software do IFPR.

O sistema permite o gerenciamento financeiro por meio de carteiras, transações, categorias e usuários, utilizando dados mockados durante o desenvolvimento do frontend.

---

# Tecnologias

- React
- Vite
- React Router DOM
- React Icons
- CSS3
- JavaScript (ES6)

---

# Funcionalidades

- Login
- Cadastro de usuário
- Recuperação de senha
- Alteração de senha
- Dashboard
- Gerenciamento de carteiras
- Gerenciamento de transações
- Gerenciamento de categorias
- Gerenciamento de usuários
- Sistema de autenticação utilizando Context API
- Dados simulados (Mock)

---

# Estrutura do Projeto

```
frontend
│
├── public/
│
├── src/
│   │
│   │
│   ├── components/
│   │   ├── Category/
│   │   ├── Global/
│   │   ├── Transactions/
│   │   ├── Wallet/
│   │   └── ProtectedRoute.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── mocks/
│   │   ├── categoryMock.js
│   │   ├── dashboardMock.js
│   │   ├── transactionMock.js
│   │
│   ├── pages/
│   │   ├── Categories/
│   │   ├── ChangePassword/
│   │   ├── Dashboard/
│   │   ├── ForgotPassword/
│   │   ├── Login/
│   │   ├── Profile/
│   │   ├── Register/
│   │   ├── ResetPassword/
│   │   └── Transactions/
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── services/
│   │   └── authService.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

---

# Organização

### Components

Contém todos os componentes reutilizáveis da aplicação.

Exemplos:

- Header
- Footer
- Modais
- Componentes de Carteira
- Componentes de Usuário
- Componentes de Categoria
- Componentes de Transação

---

### Pages

Contém as páginas principais do sistema.

- Dashboard
- Login
- Cadastro
- Carteiras
- Transações
- Categorias
- Usuários
- Recuperação de senha

---

### Context

Responsável pelo gerenciamento global da autenticação utilizando React Context API.

Atualmente controla:

- usuário autenticado
- login
- logout
- persistência via LocalStorage

---

### Services

Camada responsável pela comunicação com os serviços da aplicação.

Atualmente contém:

- autenticação (mock)

Posteriormente será integrada ao backend Spring Boot.

---

### Mocks

Armazena dados simulados utilizados durante o desenvolvimento do frontend.

- dashboardMock
- walletMock
- transactionMock
- categoryMock

Esses arquivos serão substituídos pelas respostas da API durante a integração com o backend.

---

# Instalação

Clone o projeto

```bash
git clone https://github.com/GabrielLucim/controle-financeiro.git
```

Entre na pasta

```bash
cd controle-financeiro/frontend
```

Instale as dependências

```bash
npm install
```

Execute o projeto

```bash
npm run dev
```

---

# Backend

Atualmente o frontend utiliza dados mockados.

O backend será desenvolvido em:

- Java
- Spring Boot
- Spring Data JPA
- MySQL

A integração ocorrerá substituindo os arquivos presentes em `src/mocks` por requisições HTTP aos endpoints da API.

---

# Autor

Gabriel Lucim

Instituto Federal do Paraná — IFPR

Engenharia de Software