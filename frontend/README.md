# FinControl — Frontend

Frontend do FinControl, aplicação de controle financeiro pessoal e compartilhado. A interface foi desenvolvida com React e Vite e consome a API REST do backend Spring Boot.

## Funcionalidades

- Cadastro, login e encerramento de sessão.
- Recuperação e redefinição de senha por e-mail.
- Verificação Cloudflare Turnstile no fluxo de login quando solicitada pelo backend.
- Dashboard com saldo, receitas, despesas e carteiras disponíveis para o usuário.
- Criação e gerenciamento de carteiras.
- Compartilhamento de carteiras e gerenciamento de participantes e permissões.
- Cadastro, consulta, edição e exclusão de transações.
- Cadastro, consulta, edição e exclusão de categorias.
- Relatório mensal com totais de receitas e despesas, saldo do período, valores por categoria e lista de transações.
- Análise textual do relatório mensal por meio da API Gemini.
- Atualização das telas de Dashboard e Transações por Server-Sent Events (SSE) quando há alterações nas transações de uma carteira compartilhada.
- Página de perfil com visualização dos dados da conta e alteração de senha.
- Instalação como Progressive Web App (PWA), com cache de arquivos estáticos e carregamento básico da estrutura da aplicação sem conexão.

O modo offline não armazena dados financeiros nem permite executar operações que dependem do backend. Para consultar ou alterar informações, é necessário estar conectado à API.

## Tecnologias

- React 19
- Vite 5
- JavaScript (ES modules)
- React Router DOM
- Axios
- Recharts
- React Hook Form e Zod
- React Icons e Lucide React
- CSS

## Organização do código

A aplicação separa páginas, componentes reutilizáveis, contexto de autenticação, rotas e serviços de comunicação com a API.

```text
frontend/
├── public/
│   ├── icons/
│   ├── favicon.svg
│   ├── icons.svg
│   ├── manifest.json
│   ├── pwa-icon.svg
│   └── sw.js
├── src/
│   ├── components/
│   │   ├── AddWalletMemberModal/
│   │   ├── Category/
│   │   ├── Global/
│   │   ├── Transactions/
│   │   ├── Wallet/
│   │   ├── WalletMembersModal/
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
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
│   ├── routes/
│   │   └── AppRoutes.jsx
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
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

### Páginas e rotas

| Caminho | Acesso | Página |
|---|---|---|
| `/login` | Público | Login |
| `/cadastro` | Público | Cadastro |
| `/recuperar-senha` | Público | Solicitação de recuperação de senha |
| `/redefinir-senha/:token` | Público | Redefinição de senha |
| `/app/dashboard` | Autenticado | Dashboard e carteiras |
| `/app/transacoes` | Autenticado | Transações |
| `/app/categorias` | Autenticado | Categorias |
| `/app/relatorios` | Autenticado | Relatórios e análise financeira |
| `/app/perfil` | Autenticado | Perfil e alteração de senha |

A definição das rotas está em `src/routes/AppRoutes.jsx`. O componente `ProtectedRoute` impede a abertura das páginas internas sem uma sessão autenticada.

### Comunicação com a API

As chamadas HTTP ficam em `src/services/` e utilizam a instância Axios definida em `src/services/api.js`. A URL base é lida de `VITE_API_URL`.

O token JWT é mantido no `localStorage` pelo `AuthContext` e enviado pelo Axios no cabeçalho:

```http
Authorization: Bearer <token>
```

O serviço `transactionEventService.js` solicita um ticket temporário à API e abre a conexão SSE com `EventSource`. Quando recebe o evento `transaction-changed`, as páginas inscritas atualizam os dados exibidos.

## Requisitos para executar

- Node.js instalado.
- npm instalado.
- Backend do FinControl em execução e banco de dados configurado para que as funcionalidades que consultam ou alteram dados funcionem.

## Configuração do ambiente

Na pasta `frontend`, crie o arquivo `.env` a partir do exemplo:

```powershell
Copy-Item .env.example .env
```

Configure as variáveis:

| Variável | Uso |
|---|---|
| `VITE_API_URL` | Endereço base da API. No ambiente local, use `http://localhost:8080`. |
| `VITE_TURNSTILE_SITE_KEY` | Chave pública do site Cloudflare Turnstile usada pelo componente de verificação no login. |

O arquivo `.env.example` já contém os nomes das variáveis e valores de exemplo. Ajuste-os conforme o ambiente. A chave pública do Turnstile deve corresponder à chave secreta configurada no backend.

Variáveis com prefixo `VITE_` são incorporadas ao bundle disponibilizado ao navegador. Não coloque senhas, tokens privados ou chaves secretas nessas variáveis.

## Instalação e execução

A partir da raiz do repositório:

```bash
cd frontend
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Por padrão, o Vite disponibiliza a aplicação em:

```text
http://localhost:5173
```

Para gerar a versão de produção:

```bash
npm run build
```

Os arquivos compilados são gerados na pasta `dist/`.

Para visualizar localmente a versão compilada:

```bash
npm run preview
```

Para executar o ESLint:

```bash
npm run lint
```

## Progressive Web App (PWA)

O manifesto está em `public/manifest.json`, os ícones ficam em `public/icons/` e o service worker está em `public/sw.js`. O registro do service worker acontece em `src/main.jsx` somente na versão de produção.

Na instalação, o service worker armazena o HTML inicial, o manifesto, os ícones e os arquivos estáticos JS/CSS referenciados pela página. Em uma navegação sem conexão, tenta apresentar o HTML armazenado. As requisições à API não são armazenadas em cache.

Para testar o comportamento de produção localmente, execute `npm run build` e depois `npm run preview`. O navegador permite testar recursos de service worker em `localhost`. Em uma hospedagem pública, a instalação do PWA requer HTTPS.

## Integração com o backend

O frontend espera que a API esteja acessível pelo endereço definido em `VITE_API_URL`. O backend também precisa permitir a origem do frontend na configuração CORS (`CORS_ALLOWED_ORIGINS`). Consulte o README do backend para configurar banco de dados, e-mail, JWT, Turnstile e Gemini.

## Implantação

A publicação pública do projeto ainda está em preparação. Os endereços do frontend e da API devem ser registrados aqui depois da conclusão do deploy.

## Repositório

[github.com/GabrielLucim/controle-financeiro](https://github.com/GabrielLucim/controle-financeiro)
