# FinControl — Frontend

Frontend oficial do **FinControl**, desenvolvido em **React + Vite**, como parte do projeto da disciplina de Engenharia de Software do Instituto Federal do Paraná (IFPR).

O sistema tem como objetivo fornecer uma interface para gerenciamento financeiro pessoal e compartilhado. Por meio dele, os usuários podem organizar carteiras, acompanhar saldos, registrar receitas e despesas, gerenciar categorias, compartilhar carteiras com outras pessoas e consultar relatórios financeiros.

O frontend comunica-se com a API REST desenvolvida em Spring Boot. A autenticação utiliza JWT, enviado nas requisições protegidas por meio do cabeçalho `Authorization`.

---

# Tecnologias Utilizadas

- React 19
- Vite 5
- JavaScript (ES Modules)
- React Router DOM
- Axios
- Recharts
- React Hook Form
- Zod
- React Icons
- Lucide React
- CSS3
- Context API

---

# Arquitetura

O frontend segue uma arquitetura baseada em componentes, organizada por responsabilidades.

A aplicação é dividida em:

- **Páginas:** telas relacionadas às funcionalidades principais.
- **Componentes reutilizáveis:** elementos de interface, modais, cabeçalho, rodapé e componentes de apoio.
- **Serviços:** módulos responsáveis pela comunicação com a API.
- **Contexto global:** gerenciamento do estado de autenticação.
- **Rotas:** definição das páginas públicas e protegidas.
- **Estilos:** arquivos CSS organizados junto às páginas e componentes, além do estilo global.

Toda comunicação HTTP com o backend é realizada pela camada de serviços, utilizando uma instância compartilhada do Axios.

---

# Funcionalidades Implementadas

## Autenticação

- Login de usuários.
- Cadastro de usuários.
- Logout.
- Persistência da sessão utilizando JWT no LocalStorage.
- Proteção das rotas internas.
- Recuperação de senha por e-mail.
- Redefinição de senha por meio de um token temporário.
- Integração com Cloudflare Turnstile no login quando a API solicita a verificação após tentativas inválidas.

## Dashboard

- Saudação personalizada.
- Resumo financeiro com saldo, receitas e despesas.
- Listagem das carteiras disponíveis para o usuário.
- Acesso às transações de uma carteira selecionada.
- Criação e exclusão de carteiras.
- Acesso ao gerenciamento de participantes das carteiras compartilhadas.
- Atualização dos dados quando uma alteração em transações é recebida pelo SSE.

## Carteiras

- Listagem das carteiras do usuário.
- Criação de carteiras.
- Exclusão de carteiras.
- Compartilhamento de carteiras com outros usuários.
- Listagem dos participantes de uma carteira.
- Inclusão, alteração de papel e remoção de participantes.

Os papéis disponíveis no backend são `DONO`, `EDITOR` e `VISUALIZADOR`. As permissões para cada operação são verificadas pela API.

## Categorias

- Listagem de categorias.
- Criação de categorias.
- Edição de categorias.
- Exclusão de categorias.
- Consulta de categorias relacionadas às carteiras, quando aplicável.

## Transações

- Listagem de transações.
- Criação de receitas e despesas.
- Edição de transações.
- Exclusão de transações.
- Filtro de transações por carteira.
- Atualização automática da listagem quando outro membro realiza uma alteração em uma carteira compartilhada.
- Indicador do estado da conexão em tempo real.

## Relatórios

- Seleção de carteira, mês e ano.
- Resumo do período com total de receitas, despesas e saldo.
- Quantidade de transações do período.
- Gráficos e listagens de valores agrupados por categoria.
- Extrato das transações que compõem o relatório.

## Análise Financeira com IA

A página de Relatórios permite solicitar uma análise textual dos dados do mês selecionado. O frontend envia à API a carteira, o ano e o mês; o backend consulta o relatório e utiliza a integração com Google Gemini para gerar a análise.

A chave privada da API Gemini fica somente no backend. O frontend não acessa o provedor de IA diretamente.

## Usuário e Perfil

- Visualização dos dados da conta.
- Alteração de senha.
- Acesso às funcionalidades de autenticação e recuperação de senha.

## Progressive Web App (PWA)

- Manifesto configurado para instalação da aplicação.
- Ícones nos tamanhos 192 × 192 e 512 × 512.
- Service worker registrado na versão de produção.
- Cache do HTML inicial e de arquivos estáticos necessários para abrir a estrutura do frontend.
- Carregamento básico da aplicação quando o dispositivo está sem conexão.

O modo offline não armazena dados financeiros e não permite realizar operações que dependem do backend. Consultas, autenticação, criação e alteração de informações continuam exigindo conexão com a API.

---

# Integração com Backend

O frontend utiliza requisições HTTP reais para acessar os dados persistidos no banco de dados pelo backend. As estruturas mockadas utilizadas durante o desenvolvimento foram substituídas pela comunicação com os endpoints REST.

A autenticação utiliza JWT enviado automaticamente pelo Axios no cabeçalho:

```http
Authorization: Bearer <token>
```

A URL da API é configurada pela variável `VITE_API_URL`.

---

# Estrutura do Projeto

```text
frontend/
│
├── public/
│   ├── icons/
│   │   ├── pwa-192.png
│   │   └── pwa-512.png
│   ├── favicon.svg
│   ├── icons.svg
│   ├── manifest.json
│   ├── pwa-icon.svg
│   └── sw.js
│
├── src/
│   ├── components/
│   │   ├── AddWalletMemberModal/
│   │   ├── Category/
│   │   ├── Global/
│   │   │   ├── DeleteConfirmModal/
│   │   │   ├── Footer/
│   │   │   └── Header/
│   │   ├── Transactions/
│   │   ├── Wallet/
│   │   ├── WalletMembersModal/
│   │   └── ProtectedRoute.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── Categories/
│   │   ├── Dashboard/
│   │   ├── ForgotPassword/
│   │   ├── Login/
│   │   ├── Profile/
│   │   ├── Register/
│   │   ├── Reports/
│   │   ├── ResetPassword/
│   │   └── Transactions/
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── services/
│   │   ├── aiService.js
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── categoryService.js
│   │   ├── dashboardService.js
│   │   ├── reportService.js
│   │   ├── transactionEventService.js
│   │   ├── transactionService.js
│   │   ├── walletMemberService.js
│   │   └── walletService.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env.example
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

# Organização da Aplicação

## Components

A pasta **components** concentra os componentes reutilizáveis do sistema.

Entre eles estão:

- Cabeçalho e rodapé.
- Modais de confirmação e formulários.
- Componentes de carteiras.
- Componentes de participantes de carteiras compartilhadas.
- Componentes de categorias.
- Componentes de transações.
- `ProtectedRoute`, responsável por restringir o acesso às páginas internas.

Essa divisão evita repetição de código e facilita a manutenção da interface.

## Pages

Cada funcionalidade principal possui sua própria página:

- **Login:** autenticação do usuário.
- **Register:** cadastro de usuário.
- **Dashboard:** resumo financeiro e gerenciamento de carteiras.
- **ForgotPassword:** solicitação de recuperação de senha.
- **ResetPassword:** redefinição de senha pelo token recebido.
- **Transactions:** consulta e gerenciamento de transações.
- **Categories:** gerenciamento de categorias.
- **Reports:** relatórios mensais e análise com IA.
- **Profile:** informações da conta e alteração de senha.

Cada página concentra a lógica relacionada à sua funcionalidade e utiliza componentes e serviços quando necessário.

## Services

Toda comunicação com o backend é realizada pela camada de serviços. Cada serviço encapsula as chamadas relacionadas a uma parte do sistema.

| Serviço | Responsabilidade |
|---|---|
| `api.js` | Instância Axios, URL base e envio automático do JWT. |
| `authService.js` | Login, cadastro, recuperação, redefinição e alteração de senha. |
| `dashboardService.js` | Consulta dos dados do dashboard. |
| `walletService.js` | Operações com carteiras. |
| `walletMemberService.js` | Gerenciamento dos participantes das carteiras. |
| `transactionService.js` | Operações com transações. |
| `transactionEventService.js` | Emissão de ticket e conexão com o fluxo SSE. |
| `categoryService.js` | Operações com categorias. |
| `reportService.js` | Consulta dos relatórios mensais. |
| `aiService.js` | Solicitação de análise financeira à API do backend. |

Essa separação evita chamadas HTTP diretamente dentro das páginas e mantém a comunicação com a API centralizada.

## Context

O gerenciamento da autenticação é realizado através da Context API do React.

O `AuthContext` é responsável por:

- Armazenar os dados do usuário autenticado.
- Armazenar o token JWT.
- Realizar login.
- Realizar logout.
- Restaurar os dados da sessão após atualizar a página, utilizando o LocalStorage.

## Organização dos Estilos

As páginas e os componentes possuem arquivos CSS próprios, organizados junto aos respectivos módulos. O arquivo `src/index.css` concentra os estilos globais.

Exemplo:

```text
Dashboard/
├── Dashboard.jsx
└── Dashboard.css
```

Essa abordagem facilita a manutenção e reduz conflitos entre estilos de diferentes partes da aplicação.

---

# Rotas da Aplicação

As rotas são organizadas através do React Router DOM. O arquivo responsável pelo gerenciamento é:

```text
src/routes/AppRoutes.jsx
```

A rota inicial `/` redireciona para `/login`.

## Rotas Públicas

| Caminho | Funcionalidade |
|---|---|
| `/login` | Login. |
| `/cadastro` | Cadastro. |
| `/recuperar-senha` | Solicitação de recuperação de senha. |
| `/redefinir-senha/:token` | Redefinição de senha por token. |

## Rotas Protegidas

| Caminho | Funcionalidade |
|---|---|
| `/app/dashboard` | Dashboard e carteiras. |
| `/app/transacoes` | Transações. |
| `/app/categorias` | Categorias. |
| `/app/relatorios` | Relatórios e análise financeira. |
| `/app/perfil` | Perfil e alteração de senha. |

O acesso às rotas protegidas é controlado pelo componente `ProtectedRoute.jsx`.

---

# Fluxo de Autenticação

O fluxo de autenticação da aplicação funciona da seguinte forma:

1. O usuário realiza login informando e-mail e senha.
2. O frontend envia as credenciais para o endpoint `/auth/login`.
3. O backend valida as credenciais e, quando necessário, exige a verificação do Cloudflare Turnstile.
4. Em caso de sucesso, a API retorna o token JWT e os dados do usuário.
5. O frontend armazena essas informações no LocalStorage.
6. O `AuthContext` atualiza o estado global da aplicação.
7. O Axios passa a enviar automaticamente o token nas requisições protegidas.
8. Ao realizar logout, o token e os dados do usuário são removidos do LocalStorage.

O token fica armazenado no navegador. Portanto, não deve ser tratado como um segredo inacessível ao JavaScript da página.

---

# Recuperação de Senha

O fluxo de recuperação de senha é integrado ao backend e utiliza envio de e-mail.

O funcionamento é:

1. O usuário informa seu e-mail na página de recuperação.
2. O backend gera um token temporário e envia um link por e-mail.
3. O usuário acessa o link recebido, que abre a página `/redefinir-senha/:token`.
4. A página informa o início do processo de redefinição ao backend.
5. O usuário informa e confirma a nova senha.
6. O backend valida o token e altera a senha.

O token possui prazo de validade controlado pelo backend. A redefinição só pode ser concluída com um token válido.

---

# Comunicação em Tempo Real (SSE)

O frontend utiliza **Server-Sent Events (SSE)** para atualizar o Dashboard e a página de Transações quando há alterações em transações de carteiras compartilhadas.

O fluxo implementado é:

1. O frontend solicita um ticket temporário ao endpoint autenticado `POST /transactions/stream-ticket`.
2. O backend retorna um ticket de uso único.
3. O frontend abre uma conexão `EventSource` com `GET /transactions/stream?ticket=...`.
4. Quando uma transação é criada, alterada ou excluída, os usuários conectados que participam da carteira recebem o evento `transaction-changed`.
5. As páginas inscritas consultam novamente os dados necessários para atualizar a interface.

O serviço `transactionEventService.js` controla o estado da conexão e tenta reconectar quando ocorre uma interrupção. O fluxo de eventos não substitui as requisições REST utilizadas para consultar e alterar os dados.

---

# Variáveis de Ambiente

A aplicação utiliza variáveis de ambiente para configurar o endereço da API e a chave pública do Cloudflare Turnstile.

Crie um arquivo `.env` na raiz do frontend a partir do exemplo:

```powershell
Copy-Item .env.example .env
```

Configure as variáveis:

| Variável | Finalidade | Exemplo local |
|---|---|---|
| `VITE_API_URL` | URL base da API do backend. | `http://localhost:8080` |
| `VITE_TURNSTILE_SITE_KEY` | Chave pública do site Cloudflare Turnstile exibido no login. | Chave pública fornecida pelo Cloudflare. |

O arquivo `.env.example` contém os nomes das variáveis. Ajuste os valores conforme o ambiente.

A chave pública do Turnstile deve corresponder à chave secreta configurada no backend. Variáveis com prefixo `VITE_` são incorporadas ao código enviado ao navegador. Não coloque senhas, tokens privados ou chaves secretas nessas variáveis.

---

# Requisitos para Executar

- Node.js.
- npm.
- Backend do FinControl em execução.
- Banco de dados e integrações do backend configurados para utilizar as funcionalidades que dependem deles.

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

Crie e configure o arquivo `.env`, conforme a seção de variáveis de ambiente.

---

# Executando a Aplicação

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Por padrão, a aplicação estará disponível em:

```text
http://localhost:5173
```

É necessário que o backend esteja em execução para que as funcionalidades que consultam ou alteram dados estejam disponíveis.

Para gerar a versão de produção:

```bash
npm run build
```

Os arquivos compilados são gerados na pasta `dist/`.

Para visualizar localmente a versão compilada:

```bash
npm run preview
```

Para executar a verificação do ESLint:

```bash
npm run lint
```

---

# Progressive Web App (PWA)

A configuração do PWA está distribuída nos seguintes arquivos:

- `public/manifest.json`: nome, ícones, cores e modo de exibição do aplicativo instalado.
- `public/icons/`: ícones de 192 × 192 e 512 × 512 pixels.
- `public/sw.js`: service worker responsável pelo cache do app shell e dos arquivos estáticos.
- `src/main.jsx`: registra o service worker somente na versão de produção.

Para testar o PWA localmente, gere a versão de produção e inicie o preview:

```bash
npm run build
npm run preview
```

O navegador permite testar service workers em `localhost`. Em um endereço publicado, a instalação do PWA exige HTTPS.

O cache permite abrir a estrutura do frontend sem conexão, mas não armazena respostas financeiras da API. Recursos como login, consultas, lançamentos, relatórios e análise com IA dependem de conexão com o backend.

---

# Integração com o Backend

O frontend espera que a API esteja disponível no endereço definido em `VITE_API_URL`.

A configuração da instância Axios encontra-se em:

```text
src/services/api.js
```

Quando há um usuário autenticado, o token JWT salvo no LocalStorage é enviado automaticamente pelo cabeçalho:

```http
Authorization: Bearer <token>
```

O backend deve permitir a origem do frontend na configuração de CORS, por meio de `CORS_ALLOWED_ORIGINS`. Consulte o README do backend para configurar o banco de dados, JWT, envio de e-mails, Turnstile, Gemini e Swagger/OpenAPI.

---

# Estrutura de Desenvolvimento

O frontend foi desenvolvido priorizando:

- Componentização.
- Separação de responsabilidades.
- Reutilização de código.
- Centralização das chamadas à API.
- Controle de autenticação e proteção de rotas.
- Facilidade de manutenção e evolução das funcionalidades.

Cada funcionalidade é organizada em módulos, permitindo que novas telas e serviços sejam adicionados sem concentrar toda a lógica em um único arquivo.

---

# Implantação

A publicação pública do projeto está em preparação. Após a conclusão do deploy, os endereços do frontend e da API serão registrados nesta seção.

---

# Repositório

Frontend:

[https://github.com/GabrielLucim/controle-financeiro](https://github.com/GabrielLucim/controle-financeiro)

---

# Autor

**Gabriel Dos Anjos Lucim**

Instituto Federal do Paraná — IFPR

Curso de Engenharia de Software

Disciplina de Engenharia de Software
