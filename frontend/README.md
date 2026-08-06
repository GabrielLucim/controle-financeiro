# FinControl — Frontend

Frontend oficial do **FinControl**, desenvolvido em **React + Vite**, como parte do projeto da disciplina de Engenharia de Software do Instituto Federal do Paraná (IFPR).

O sistema tem como objetivo fornecer uma interface moderna para gerenciamento financeiro pessoal, permitindo que usuários realizem autenticação, organizem suas carteiras financeiras, acompanhem saldos, receitas, despesas e gerenciem suas transações.

O frontend comunica-se diretamente com a API REST desenvolvida em Spring Boot utilizando autenticação baseada em JWT.

---

# Tecnologias Utilizadas

- React
- Vite
- JavaScript (ES6+)
- React Router DOM
- Axios
- React Icons
- CSS3
- Context API

---

# Arquitetura

O frontend segue uma arquitetura baseada em componentes, organizada por responsabilidades.

A aplicação é dividida em:

- Páginas
- Componentes reutilizáveis
- Serviços responsáveis pela comunicação com a API
- Contexto global de autenticação
- Rotas protegidas
- Estilos separados por módulo

Toda comunicação com o backend ocorre através da camada de serviços utilizando Axios.

---

# Funcionalidades Implementadas

Atualmente o frontend possui as seguintes funcionalidades:

## Autenticação

- Login
- Cadastro de usuários
- Logout
- Persistência da sessão utilizando JWT
- Rotas protegidas
- Recuperação de senha por e-mail
- Redefinição de senha através de token

---

## Dashboard

- Saudação personalizada
- Resumo financeiro
    - Saldo total
    - Total de receitas
    - Total de despesas
- Listagem de carteiras
- Navegação para detalhes da carteira
- Criação de novas carteiras através de modal

---

## Carteiras

- Listagem de carteiras
- Criação de carteira
- Visualização das informações
- Integração completa com a API

---

## Usuário

- Cadastro
- Login
- Alteração de senha
- Recuperação de senha por e-mail

---

## Integração com Backend

O frontend já está integrado ao backend utilizando requisições HTTP reais.

As antigas estruturas mockadas foram substituídas pelos endpoints REST da API.

A autenticação utiliza JWT enviado automaticamente pelo Axios através do header:

Authorization: Bearer TOKEN

---

# Estrutura do Projeto

```
frontend
│
├── public
│
├── src
│   │
│   │
│   ├── components
│   │   ├── Category
│   │   ├── Global
│   │   ├── Transactions
│   │   ├── Wallet
│   │   └── ProtectedRoute.jsx
│   │
│   ├── context
│   │   └── AuthContext.jsx
│   │
│   ├── pages
│   │   ├── Categories
│   │   ├── Dashboard
│   │   ├── ForgotPassword
│   │   ├── Login
│   │   ├── Profile
│   │   ├── Register
│   │   ├── ResetPassword
│   │   └── Transactions
│   │
│   ├── routes
│   │   └── AppRoutes.jsx
│   │
│   ├── services
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── dashboardService.js
│   │   ├── transactionService.js
│   │   ├── categoryService.js
│   │   └── walletService.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env
├── package.json
├── vite.config.js
└── README.md
```

---

# Organização da Aplicação

## Components

A pasta **components** concentra todos os componentes reutilizáveis do sistema.

Exemplos:

- Header
- Footer
- Modais
- Cards
- Componentes de Carteiras
- Componentes de Categorias
- Componentes de Transações

Essa divisão evita repetição de código e facilita manutenção.

---

## Pages

Cada funcionalidade principal da aplicação possui sua própria página.

Entre elas:

- Login
- Cadastro
- Dashboard
- Recuperação de senha
- Redefinição de senha
- Carteiras
- Categorias
- Transações
- Perfil

Cada página é responsável apenas pela lógica daquela funcionalidade.

---

## Services

Toda comunicação com o backend é realizada pela camada de serviços.

Cada serviço encapsula os endpoints relacionados ao seu domínio.

Exemplos:

- authService
- dashboardService
- walletService
- transactionService
- categoryService

Isso evita chamadas HTTP diretamente dentro das páginas.

---

## Context

O gerenciamento da autenticação é realizado através da Context API.

O AuthContext é responsável por:

- armazenar o usuário autenticado
- armazenar o token JWT
- realizar login
- realizar logout
- manter a sessão após atualizar a página

---

# Variáveis de Ambiente

A aplicação utiliza variáveis de ambiente para definir a URL base da API.

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8080
```

O Axios utiliza essa variável para realizar todas as requisições ao backend.

---

# Instalação

Clone o repositório:

```bash
git clone https://github.com/GabrielLucim/controle-financeiro.git
```

Entre na pasta do frontend:

```bash
cd controle-financeiro/frontend
```

Instale as dependências:

```bash
npm install
```

---

# Executando a Aplicação

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Por padrão, a aplicação estará disponível em:

```
http://localhost:5173
```

É necessário que o backend esteja em execução para que todas as funcionalidades estejam disponíveis.

---

# Comunicação com a API

Todas as requisições HTTP são realizadas utilizando Axios.

A configuração da instância da API encontra-se em:

```
src/services/api.js
```

Sempre que um usuário estiver autenticado, o token JWT armazenado no LocalStorage é automaticamente enviado para o backend através do header:

```http
Authorization: Bearer <token>
```

Isso permite que as rotas protegidas sejam acessadas sem necessidade de realizar login novamente durante a sessão.

---

# Fluxo de Autenticação

O fluxo de autenticação da aplicação funciona da seguinte forma:

1. O usuário realiza login informando e-mail e senha.

2. O backend valida as credenciais.

3. Em caso de sucesso, a API retorna:

- Token JWT
- Dados do usuário

4. O frontend armazena essas informações no LocalStorage.

5. O AuthContext atualiza o estado global da aplicação.

6. O Axios passa a enviar automaticamente o token em todas as requisições protegidas.

7. Ao realizar logout, o token e os dados do usuário são removidos do LocalStorage.

---

# Recuperação de Senha

O fluxo de recuperação de senha foi integrado ao backend.

O funcionamento é:

1. O usuário informa seu e-mail.

2. O backend gera um token temporário.

3. Um e-mail é enviado contendo o link de redefinição.

4. O usuário acessa o link recebido.

5. Uma nova senha é cadastrada.

6. O backend invalida o token utilizado.

---

# Rotas da Aplicação

As rotas são organizadas através do React Router DOM.

O arquivo responsável pelo gerenciamento das rotas é:

```
src/routes/AppRoutes.jsx
```

Existem dois grupos principais de rotas:

### Rotas Públicas

- Login
- Cadastro
- Recuperação de senha
- Redefinição de senha

### Rotas Protegidas

- Dashboard
- Carteiras
- Categorias
- Transações
- Perfil
- Alteração de senha

O acesso às rotas protegidas é controlado pelo componente:

```
ProtectedRoute.jsx
```

---

# Organização dos Estilos

Cada página possui seu próprio arquivo CSS.

Exemplo:

```
Dashboard/
├── Dashboard.jsx
└── Dashboard.css
```

Essa abordagem facilita a manutenção e evita conflitos entre estilos de diferentes módulos.

---

# Estrutura de Desenvolvimento

O frontend foi desenvolvido priorizando:

- Componentização
- Separação de responsabilidades
- Reutilização de código
- Facilidade de manutenção
- Integração com API REST

Cada funcionalidade foi organizada em módulos independentes, permitindo evolução do sistema sem necessidade de grandes alterações estruturais.

---

# Repositório

Frontend:

```
https://github.com/GabrielLucim/controle-financeiro
```

---

# Autor

**Gabriel Dos Anjos Lucim**

Instituto Federal do Paraná — IFPR

Curso de Engenharia de Software

Disciplina de Engenharia de Software