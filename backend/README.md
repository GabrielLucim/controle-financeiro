# FinControl — Backend

Backend oficial do **FinControl**, desenvolvido em **Java 21** utilizando **Spring Boot**, como parte do projeto da disciplina de Engenharia de Software do Instituto Federal do Paraná (IFPR).

O sistema disponibiliza uma API REST responsável pelo gerenciamento de usuários, autenticação, recuperação de senha, carteiras financeiras, participantes de carteiras compartilhadas, categorias, transações, dashboard, relatórios e análise financeira com IA.

A autenticação é realizada utilizando **JWT (JSON Web Token)**. O envio de e-mails utiliza **JavaMailSender** com templates HTML processados pelo **Thymeleaf**. O acesso aos dados é realizado por meio do Spring Data JPA e do MySQL.

---

# Arquitetura

O backend foi desenvolvido seguindo uma arquitetura em camadas (*Layered Architecture*), promovendo separação de responsabilidades e facilidade de manutenção.

A estrutura geral é composta por:

- **Controllers:** recebem e respondem às requisições HTTP.
- **Services:** concentram as regras de negócio.
- **Repositories:** realizam o acesso aos dados.
- **Entities:** representam as entidades persistidas no banco.
- **DTOs:** definem os dados recebidos e enviados pela API.
- **Configurações:** centralizam configurações de segurança, CORS, senha e documentação.
- **Segurança:** autenticação JWT e filtros do Spring Security.
- **Tratamento de exceções:** padroniza as respostas de erro.

O acesso aos dados é realizado através do Spring Data JPA utilizando o padrão Repository.

---

# Tecnologias Utilizadas

- Java 21
- Spring Boot 4.1.0
- Spring Web MVC
- Spring Security
- Spring Data JPA
- Hibernate
- Bean Validation
- MySQL Connector/J
- JWT (JJWT 0.12.7)
- JavaMailSender
- Thymeleaf
- Google GenAI SDK 2.2.0
- Springdoc OpenAPI 3.2.1
- Lombok
- Maven e Maven Wrapper

---

# Estrutura do Projeto

```text
backend/
│
├── .mvn/
│   └── wrapper/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── br/edu/ifpr/fincontrol/backend/
│   │   │       ├── config/
│   │   │       ├── controller/
│   │   │       ├── dto/
│   │   │       │   ├── request/
│   │   │       │   │   └── ai/
│   │   │       │   └── response/
│   │   │       │       ├── ai/
│   │   │       │       ├── dashboard/
│   │   │       │       └── report/
│   │   │       ├── entity/
│   │   │       │   └── enums/
│   │   │       ├── exception/
│   │   │       ├── repository/
│   │   │       ├── security/
│   │   │       ├── service/
│   │   │       │   └── ai/
│   │   │       └── BackendApplication.java
│   │   │
│   │   └── resources/
│   │       ├── templates/
│   │       │   └── mail/
│   │       ├── application.properties
│   │       └── application-secrets.properties.example
│   │
│   └── test/
│
├── mvnw
├── mvnw.cmd
├── pom.xml
└── README.md
```

---

# Organização das Camadas

## Controller

Responsável por disponibilizar os endpoints REST da aplicação.

Cada controller recebe as requisições HTTP, valida os dados recebidos quando necessário e delega o processamento para a camada de serviço.

Os controllers implementados são:

- `AuthController`
- `DashboardController`
- `WalletController`
- `WalletMemberController`
- `TransactionController`
- `CategoryController`
- `ReportController`
- `AiController`
- `UserController`

## Service

Contém as regras de negócio da aplicação.

Nesta camada são realizadas operações como:

- Cadastro e autenticação de usuários.
- Geração e validação de tokens JWT.
- Recuperação e redefinição de senha.
- Envio de e-mails.
- Validação do Cloudflare Turnstile.
- Cálculo dos dados do dashboard e dos relatórios.
- Gerenciamento de carteiras e participantes.
- Controle das permissões dos participantes das carteiras.
- Gerenciamento de categorias e transações.
- Publicação de eventos para atualização em tempo real.
- Comunicação com a API Gemini para análise financeira.

## Repository

Responsável pela comunicação com o banco de dados através do Spring Data JPA.

Os repositórios utilizam `JpaRepository` para operações CRUD e consultas específicas.

## Entity

Representa as tabelas do banco de dados. As entidades utilizam anotações do JPA para mapear relacionamentos, atributos e restrições.

As principais entidades são:

- `User`
- `Wallet`
- `WalletMember`
- `Transaction`
- `Category`
- `PasswordResetToken`

## DTO

Os DTOs (*Data Transfer Objects*) são utilizados para separar os dados recebidos e enviados pela API das entidades persistidas no banco.

O projeto utiliza DTOs distintos para:

- **Request:** dados recebidos nas requisições.
- **Response:** dados retornados pela API.

Os DTOs também permitem aplicar validações nos dados recebidos sem expor diretamente as entidades do banco.

## Configuração e Segurança

A pasta `config` reúne as configurações da aplicação, incluindo Spring Security, CORS, codificação de senhas e documentação OpenAPI. A pasta `security` concentra os componentes relacionados à autenticação JWT e identificação do usuário autenticado.

O tratamento global de exceções fica na pasta `exception`.

---

# Banco de Dados

O projeto utiliza **MySQL** como sistema gerenciador de banco de dados.

As principais tabelas mapeadas pelas entidades são:

- `users`
- `wallets`
- `wallet_members`
- `categories`
- `transactions`
- `password_reset_tokens`

As tabelas são criadas e atualizadas pelo Hibernate utilizando a configuração:

```properties
spring.jpa.hibernate.ddl-auto=update
```

Essa configuração mantém o esquema do banco alinhado às entidades durante a execução. O projeto não utiliza uma ferramenta de versionamento de migrações de banco de dados.

---

# Segurança

A autenticação utiliza **Spring Security** juntamente com **JWT**.

O fluxo de autenticação é composto por:

1. O usuário envia e-mail e senha para o endpoint de login.
2. O backend valida as credenciais.
3. Em caso de sucesso, é gerado um token JWT.
4. O frontend armazena o token e o envia nas requisições protegidas pelo cabeçalho `Authorization`.
5. O `JwtFilter` valida o token e identifica o usuário da requisição.
6. Os serviços verificam as permissões do usuário sobre os dados solicitados.

As senhas são codificadas utilizando BCrypt antes de serem armazenadas no banco.

A API funciona em modo stateless, sem manter sessão HTTP para autenticação. O token JWT possui validade configurada em `jwt.expiration`, atualmente `86400000` milissegundos (24 horas).

## Controle de Acesso às Carteiras

As carteiras podem ser compartilhadas com outros usuários. Os papéis disponíveis são:

- `DONO`
- `EDITOR`
- `VISUALIZADOR`

Os serviços verificam a participação e o papel do usuário antes de permitir operações sobre carteiras, categorias e transações relacionadas. As permissões são aplicadas no backend, não dependendo apenas das restrições apresentadas na interface.

## Proteção das Rotas

As rotas de autenticação sob `/auth/**` são públicas. A conexão `GET /transactions/stream` também não recebe o JWT diretamente: ela exige um ticket temporário, emitido previamente por uma requisição autenticada. A interface Swagger e o documento OpenAPI são públicos para permitir a consulta da documentação.

As demais rotas exigem autenticação JWT.

## Rate Limiting

O filtro `AuthRateLimitFilter` limita requisições `POST` por endereço remoto e por rota, reduzindo tentativas repetidas nos endpoints sensíveis.

| Rota | Limite | Janela |
|---|---:|---:|
| `/auth/login` | 10 requisições | 15 minutos |
| `/auth/register` | 5 requisições | 15 minutos |
| `/auth/forgot-password` | 3 requisições | 15 minutos |
| `/auth/start-reset` | 5 requisições | 15 minutos |
| `/auth/reset-password` | 5 requisições | 15 minutos |

Quando o limite é excedido, a API retorna `429 Too Many Requests` e o cabeçalho `Retry-After`.

Além desse limite por endereço remoto, o login passa a exigir uma verificação Cloudflare Turnstile após três tentativas inválidas registradas para a conta.

Os contadores de rate limiting ficam em memória na instância do backend. Eles são reiniciados quando a aplicação reinicia e não são compartilhados entre múltiplas instâncias.

## Cabeçalhos HTTP e CSRF

A configuração do Spring Security mantém os cabeçalhos padrão de segurança e define também:

- `X-Frame-Options: DENY`, para impedir que a aplicação seja incorporada em frames.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy`, desabilitando câmera, microfone e geolocalização.

O CSRF está desabilitado porque a autenticação atual utiliza JWT enviado no cabeçalho `Authorization`, e não autenticação por cookie. Se o mecanismo de autenticação mudar para cookies, essa decisão deverá ser reavaliada.

## CORS

As origens permitidas são configuradas pela propriedade `CORS_ALLOWED_ORIGINS`. É possível informar mais de uma origem, separando os endereços por vírgulas.

A configuração permite os métodos `GET`, `POST`, `PUT`, `PATCH`, `DELETE` e `OPTIONS`, além dos cabeçalhos `Authorization`, `Content-Type`, `Accept` e `Origin`. O envio de credenciais por cookie não é habilitado.

---

# Recuperação de Senha

O sistema possui recuperação de senha integrada ao envio de e-mail.

O fluxo é:

1. O usuário informa seu e-mail.
2. O backend procura a conta e gera um token aleatório.
3. O token é armazenado no banco em formato de hash SHA-256, associado ao usuário e com prazo de validade de uma hora.
4. Um e-mail HTML é enviado com o link de redefinição.
5. Ao abrir o link, o frontend chama `/auth/start-reset` para informar o início do processo.
6. O usuário informa a nova senha.
7. O backend valida o token, codifica a nova senha com BCrypt e remove o registro de recuperação utilizado.

Enquanto uma recuperação iniciada ainda estiver válida, o login da conta fica bloqueado até que a senha seja redefinida ou o token expire.

Os registros são armazenados na tabela:

```text
password_reset_tokens
```

Cada registro possui usuário associado, token armazenado como hash, data de expiração e indicadores de utilização e início da redefinição.

---

# Envio de E-mails

O envio de e-mails é realizado utilizando:

- Spring Boot Starter Mail.
- `JavaMailSender`.
- Thymeleaf para processar os templates HTML.

Os templates encontram-se em:

```text
src/main/resources/templates/mail
```

Atualmente existem modelos para:

- Boas-vindas após o cadastro.
- Recuperação de senha.
- Aviso de inclusão em uma carteira compartilhada.

O serviço responsável pelo envio é `EmailService`.

---

# Integração com Cloudflare Turnstile

O backend utiliza `TurnstileService` para validar o token recebido do componente de verificação no frontend.

Após três tentativas de login inválidas registradas para uma conta, uma nova tentativa exige um token Turnstile válido. A chave secreta fica no backend, configurada por `TURNSTILE_SECRET_KEY`. A chave pública correspondente é configurada no frontend por `VITE_TURNSTILE_SITE_KEY`.

---

# Integração com Google Gemini

A análise financeira utiliza a API Google Gemini por meio do Google GenAI SDK.

O endpoint recebe o identificador da carteira, o ano e o mês. O backend consulta o relatório mensal e envia à IA os totais de receitas, despesas, saldo, quantidade de transações e valores agrupados por categoria.

A análise é solicitada pelo backend; a chave privada não é exposta ao frontend. Quando não existem transações no período, o serviço retorna uma mensagem informativa sem chamar a API Gemini.

A integração é composta por:

- `AiController`: disponibiliza o endpoint.
- `AiAnalysisService`: consulta os dados do relatório e prepara as informações enviadas à IA.
- `GeminiService`: realiza a chamada à API Google Gemini.

A análise é orientativa e utiliza os dados do período selecionado. O prompt instrui a IA a não inventar valores nem comparações históricas que não foram fornecidas.

---

# Comunicação em Tempo Real (SSE)

O backend utiliza **Server-Sent Events (SSE)** para avisar os usuários conectados quando ocorre uma alteração em transações de carteiras das quais participam.

O fluxo é:

1. O frontend realiza uma requisição autenticada para `POST /transactions/stream-ticket`.
2. O backend gera um ticket aleatório, armazena seu hash associado ao usuário e retorna o ticket.
3. O ticket expira em 60 segundos e só pode ser utilizado uma vez.
4. O frontend abre `GET /transactions/stream?ticket=...`.
5. O backend valida e consome o ticket e registra a conexão SSE do usuário.
6. Quando uma transação é criada, atualizada ou excluída, os participantes da carteira recebem o evento `transaction-changed`.

As conexões SSE possuem tempo limite de 30 minutos. Os tickets e as conexões são mantidos em memória. Por isso, o mecanismo funciona no contexto de uma instância do backend; múltiplas instâncias exigiriam compartilhamento de eventos e tickets entre elas.

---

# Variáveis de Configuração

As configurações principais ficam em:

```text
src/main/resources/application.properties
```

Esse arquivo importa, de forma opcional, `application-secrets.properties`, que deve conter as configurações locais e credenciais. O arquivo é ignorado pelo Git.

Existe um modelo com os nomes das propriedades em:

```text
src/main/resources/application-secrets.properties.example
```

Na pasta `backend`, copie o arquivo de exemplo:

**PowerShell:**

```powershell
Copy-Item src/main/resources/application-secrets.properties.example src/main/resources/application-secrets.properties
```

**Linux ou macOS:**

```bash
cp src/main/resources/application-secrets.properties.example src/main/resources/application-secrets.properties
```

Edite `application-secrets.properties` e substitua os valores ilustrativos pelos dados do ambiente. O mesmo conjunto de configurações pode ser fornecido por variáveis de ambiente na hospedagem.

## Principais Variáveis

| Variável | Finalidade | Exemplo ou padrão |
|---|---|---|
| `DB_URL` | URL JDBC do MySQL. | `jdbc:mysql://localhost:3306/fincontrol` |
| `DB_USERNAME` | Usuário do banco. | `root` no ambiente local, se aplicável. |
| `DB_PASSWORD` | Senha do banco. | Definida no ambiente local. |
| `JWT_SECRET` | Chave usada para assinar os tokens JWT. | Chave privada forte, com pelo menos 32 caracteres. |
| `MAIL_USERNAME` | Conta utilizada para enviar e-mails. | Conta Gmail configurada. |
| `MAIL_PASSWORD` | Credencial SMTP da conta de e-mail. | Senha de aplicativo do Gmail. |
| `TURNSTILE_SECRET_KEY` | Chave secreta do Cloudflare Turnstile. | Chave fornecida pelo Cloudflare. |
| `GOOGLE_API_KEY` | Chave da API Google AI Studio/Gemini. | Chave privada do projeto. |
| `GEMINI_MODEL` | Modelo Gemini utilizado. | `gemini-3.5-flash-lite` |
| `GEMINI_MAX_OUTPUT_TOKENS` | Limite de tokens da resposta gerada. | `1200` |
| `PORT` | Porta HTTP da aplicação. | `8080` |
| `FRONTEND_URL` | URL base do frontend usada nos links de recuperação de senha. | `http://localhost:5173` |
| `CORS_ALLOWED_ORIGINS` | Origens autorizadas pelo CORS, separadas por vírgula. | `http://localhost:5173` |

O tempo de expiração do JWT é configurado pela propriedade `jwt.expiration` em `application.properties` e atualmente está definido como `86400000` milissegundos (24 horas).

As propriedades de envio de e-mail também estão no `application.properties`: o projeto utiliza `smtp.gmail.com`, porta `587`, autenticação SMTP e STARTTLS.

**Não versione `application-secrets.properties`, arquivos com credenciais, chaves privadas ou tokens.** O arquivo `.example` serve apenas como modelo de configuração.

---

# Instalação

Clone o repositório:

```bash
git clone https://github.com/GabrielLucim/controle-financeiro.git
```

Entre na pasta do backend:

```bash
cd controle-financeiro/backend
```

O projeto possui Maven Wrapper (`mvnw` e `mvnw.cmd`), então não é necessário instalar uma versão específica do Maven globalmente. É necessário ter Java 21 instalado.

---

# Configuração do Banco de Dados

Antes de executar a aplicação, crie um banco de dados MySQL chamado `fincontrol`:

```sql
CREATE DATABASE fincontrol;
```

Configure a conexão por meio das variáveis `DB_URL`, `DB_USERNAME` e `DB_PASSWORD` no arquivo `application-secrets.properties` ou no ambiente de execução.

Exemplo de URL local:

```properties
DB_URL=jdbc:mysql://localhost:3306/fincontrol
DB_USERNAME=root
DB_PASSWORD=sua_senha_local
```

O Hibernate será responsável pela criação e atualização das tabelas, conforme a configuração `spring.jpa.hibernate.ddl-auto=update`.

---

# Configuração de JWT

O sistema utiliza autenticação baseada em JSON Web Token.

Configure a chave por meio de:

```properties
JWT_SECRET=sua_chave_secreta_com_mais_de_32_caracteres
```

A propriedade `jwt.secret` utiliza essa configuração para assinar e validar os tokens. A validade atual é de 86.400.000 milissegundos, equivalente a 24 horas.

Não utilize uma chave de exemplo em ambiente público e não compartilhe a chave privada.

---

# Configuração do Serviço de E-mail

Para a funcionalidade de recuperação de senha e demais notificações é necessário configurar uma conta SMTP.

O projeto utiliza Gmail SMTP:

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

MAIL_USERNAME=seu-email@gmail.com
MAIL_PASSWORD=sua-senha-de-aplicativo
```

A senha utilizada deve ser uma **Senha de Aplicativo** gerada após habilitar a autenticação em duas etapas da conta Google. Não utilize a senha normal da conta.

---

# Executando a Aplicação

Depois de configurar o banco de dados e o arquivo de credenciais, execute na pasta `backend`.

**PowerShell / Windows:**

```powershell
.\mvnw.cmd spring-boot:run
```

**Linux ou macOS:**

```bash
./mvnw spring-boot:run
```

A API será disponibilizada, por padrão, em:

```text
http://localhost:8080
```

Para compilar sem executar os testes:

```powershell
.\mvnw.cmd -DskipTests compile
```

Para executar os testes existentes:

```powershell
.\mvnw.cmd test
```

---

# Integração com o Frontend

O frontend comunica-se diretamente com esta API através do Axios.

Após a autenticação, o token JWT é enviado automaticamente nas requisições protegidas utilizando o cabeçalho:

```http
Authorization: Bearer <token>
```

A configuração de CORS permite definir as origens do frontend por meio de `CORS_ALLOWED_ORIGINS`. No ambiente local, o padrão é `http://localhost:5173`.

O frontend também utiliza a API para solicitar tickets temporários de conexão SSE, consultar relatórios e solicitar a análise financeira gerada pelo Gemini.

---

# Endpoints Implementados

Os endpoints abaixo utilizam como base `http://localhost:8080`. As rotas protegidas exigem o cabeçalho JWT, salvo as exceções indicadas na seção de segurança.

## Autenticação — `/auth`

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/auth/register` | Cadastra um usuário. |
| `POST` | `/auth/login` | Valida as credenciais e retorna o JWT e os dados do usuário. |
| `POST` | `/auth/forgot-password` | Solicita o envio do e-mail de recuperação. |
| `POST` | `/auth/start-reset?token={token}` | Informa o início do processo de redefinição usando o token recebido. |
| `POST` | `/auth/reset-password` | Valida o token e define a nova senha. |

## Dashboard — `/dashboard`

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/dashboard` | Retorna o resumo financeiro e as carteiras disponíveis ao usuário. |

## Carteiras — `/wallets`

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/wallets` | Cria uma carteira. |
| `GET` | `/wallets` | Lista as carteiras disponíveis ao usuário. |
| `GET` | `/wallets/{id}` | Consulta uma carteira. |
| `PUT` | `/wallets/{id}` | Atualiza uma carteira. |
| `DELETE` | `/wallets/{id}` | Exclui uma carteira. |

## Participantes de Carteiras — `/wallets/{walletId}/members`

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/wallets/{walletId}/members` | Lista os participantes da carteira. |
| `POST` | `/wallets/{walletId}/members` | Adiciona um participante. |
| `PATCH` | `/wallets/{walletId}/members/{userId}` | Atualiza o papel de um participante. |
| `DELETE` | `/wallets/{walletId}/members/{userId}` | Remove um participante. |

Os papéis disponíveis são `DONO`, `EDITOR` e `VISUALIZADOR`.

## Transações — `/transactions`

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/transactions` | Cria uma transação. |
| `GET` | `/transactions` | Lista as transações disponíveis ao usuário. |
| `GET` | `/transactions/{id}` | Consulta uma transação. |
| `PUT` | `/transactions/{id}` | Atualiza uma transação. |
| `DELETE` | `/transactions/{id}` | Exclui uma transação. |
| `POST` | `/transactions/stream-ticket` | Gera um ticket temporário para a conexão SSE. |
| `GET` | `/transactions/stream?ticket={ticket}` | Abre a conexão de eventos em tempo real usando o ticket. |

O ticket de conexão é de uso único e expira em 60 segundos. Quando uma transação é criada, atualizada ou excluída, os participantes conectados à carteira recebem o evento `transaction-changed`.

## Categorias — `/categories`

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/categories` | Cria uma categoria. |
| `GET` | `/categories` | Lista as categorias do usuário. Aceita o parâmetro opcional `walletId`. |
| `GET` | `/categories/{id}` | Consulta uma categoria. |
| `PUT` | `/categories/{id}` | Atualiza uma categoria. |
| `DELETE` | `/categories/{id}` | Exclui uma categoria. |

## Relatórios — `/reports`

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/reports/monthly?walletId={id}&year={ano}&month={mês}` | Retorna o relatório mensal da carteira, com totais, valores por categoria e transações do período. |

Os parâmetros `walletId`, `year` e `month` são obrigatórios.

## Análise Financeira com IA — `/ai`

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/ai/financial-analysis` | Gera uma análise financeira para a carteira e o período informados no corpo da requisição. |

O corpo da requisição recebe `walletId`, `year` e `month`. O backend consulta o relatório mensal e utiliza os dados agregados para solicitar a análise ao Gemini.

## Usuários — `/users`

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/users` | Cadastra um usuário. |
| `GET` | `/users` | Lista usuários. |
| `GET` | `/users/{id}` | Consulta um usuário. |
| `PUT` | `/users/{id}` | Atualiza os dados de um usuário. |
| `DELETE` | `/users/{id}` | Exclui um usuário. |
| `PATCH` | `/users/me/password` | Altera a senha do usuário autenticado. |

Os formatos dos corpos das requisições, parâmetros, respostas e validações podem ser consultados na documentação Swagger/OpenAPI.

---

# Documentação da API (Swagger/OpenAPI)

A API possui documentação interativa gerada com Springdoc OpenAPI.

Com o backend em execução, acesse:

- **Swagger UI:** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **Especificação OpenAPI em JSON:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

A interface Swagger é pública. Para testar endpoints protegidos, utilize o botão **Authorize** e informe o JWT obtido em `POST /auth/login`. O esquema de autenticação utilizado é HTTP Bearer com JWT.

---

# Decisões de Projeto

Durante o desenvolvimento foram adotadas decisões visando organização, segurança e manutenção do sistema:

- Utilização de arquitetura em camadas (`Controller → Service → Repository`).
- Separação entre entidades e objetos de transferência de dados (DTOs).
- Utilização do Spring Security para controle de autenticação e autorização.
- Autenticação baseada em JWT para comunicação stateless.
- Codificação de senhas com BCrypt.
- Persistência de tokens de recuperação de senha com hash e prazo de validade.
- Utilização do Spring Data JPA para abstração da camada de acesso aos dados.
- Mapeamento de relacionamentos entre entidades utilizando JPA/Hibernate.
- Utilização do JavaMailSender para envio de e-mails.
- Utilização do Thymeleaf para geração de templates HTML de e-mail.
- Separação das permissões de participantes de carteiras compartilhadas.
- Utilização de tickets temporários de uso único para estabelecer conexões SSE sem colocar o JWT diretamente na URL do fluxo de eventos.
- Uso de relatório mensal como fonte dos dados enviados à integração com Gemini.
- Configuração de CORS por origens, permitindo separar o ambiente local do ambiente de implantação.

---

# Dependências Principais

As principais dependências utilizadas no projeto são:

- Spring Boot Starter Web MVC.
- Spring Boot Starter Security.
- Spring Boot Starter Data JPA.
- Spring Boot Starter Validation.
- Spring Boot Starter Mail.
- Spring Boot Starter Thymeleaf.
- MySQL Connector/J.
- JJWT (`jjwt-api`, `jjwt-impl` e `jjwt-jackson`).
- Google GenAI SDK.
- Springdoc OpenAPI.
- Lombok.
- Dependências de teste do Spring Boot.

As versões e configurações completas estão definidas no `pom.xml`.

---

# Implantação

A publicação pública do projeto está em preparação. Após a conclusão do deploy, registre aqui o endereço público da API e atualize as configurações `PORT`, `FRONTEND_URL` e `CORS_ALLOWED_ORIGINS` de acordo com os domínios utilizados.

---

# Repositório

Backend:

[https://github.com/GabrielLucim/controle-financeiro](https://github.com/GabrielLucim/controle-financeiro)

---

# Autor

**Gabriel Dos Anjos Lucim**

Instituto Federal do Paraná — IFPR

Curso de Engenharia de Software

Disciplina de Engenharia de Software
