# FinControl — Backend

Backend oficial do **FinControl**, desenvolvido em **Java 21** utilizando **Spring Boot**, como parte do projeto da disciplina de Engenharia de Software do Instituto Federal do Paraná (IFPR).

O sistema disponibiliza uma API REST responsável pelo gerenciamento de usuários, autenticação, recuperação de senha, carteiras financeiras, dashboard e demais funcionalidades utilizadas pelo frontend.

A autenticação é realizada utilizando **JWT (JSON Web Token)** e o envio de e-mails utiliza **JavaMailSender** com templates HTML processados pelo **Thymeleaf**.

---

# Arquitetura

O backend foi desenvolvido seguindo uma arquitetura em camadas (Layered Architecture), promovendo separação de responsabilidades e facilidade de manutenção.

A estrutura geral é composta por:

- Controllers
- Services
- Repositories
- Entities
- DTOs
- Configurações
- Segurança (JWT + Spring Security)
- Tratamento de Exceções

O acesso aos dados é realizado através do Spring Data JPA utilizando o padrão Repository.

---

# Tecnologias Utilizadas

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- MySQL
- JWT (JJWT)
- JavaMailSender
- Thymeleaf
- Lombok
- Maven

---

# Estrutura do Projeto

```
backend
│
├── src
│
├── main
│   │
│   ├── java
│   │   └── br.edu.ifpr.fincontrol.backend
│   │
│   │       ├── config
│   │       ├── controller
│   │       ├── dto
│   │       │   ├── request
│   │       │   └── response
│   │       ├── entity
│   │       │   └── enums
│   │       ├── exception
│   │       ├── repository
│   │       ├── security
│   │       ├── service
│   │       └── BackendApplication.java
│   │
│   └── resources
│       ├── templates
│       │   └── mail
│       └── application.properties
│
├── pom.xml
└── README.md
```

---

# Organização das Camadas

## Controller

Responsável por disponibilizar os endpoints REST da aplicação.

Cada controller recebe as requisições HTTP, realiza a validação dos dados recebidos e delega o processamento para a camada de serviço.

Exemplos:

- AuthController
- DashboardController
- WalletController
- TransactionController
- CategoryController
- UserController

---

## Service

Contém toda a regra de negócio da aplicação.

Nesta camada são realizadas operações como:

- autenticação
- geração de tokens JWT
- recuperação de senha
- cálculo do dashboard
- gerenciamento de carteiras
- gerenciamento de transações
- gerenciamento de categorias

---

## Repository

Responsável pela comunicação com o banco de dados através do Spring Data JPA.

Os repositórios utilizam JpaRepository para operações CRUD e consultas específicas.

---

## Entity

Representa as tabelas do banco de dados.

As entidades utilizam anotações do JPA para mapear relacionamentos, atributos e restrições.

Principais entidades:

- User
- Wallet
- Transaction
- Category
- PasswordResetToken

---

## DTO

Os DTOs são utilizados para separar os dados enviados e recebidos pela API das entidades persistidas no banco.

O projeto utiliza DTOs distintos para:

- Request
- Response

Essa abordagem evita exposição direta das entidades e melhora a organização da API.

---

# Banco de Dados

O projeto utiliza **MySQL** como sistema gerenciador de banco de dados.

As tabelas são criadas automaticamente pelo Hibernate utilizando:

```properties
spring.jpa.hibernate.ddl-auto=update
```

---

# Segurança

A autenticação utiliza **Spring Security** juntamente com **JWT**.

O fluxo é composto por:

1. Login do usuário.
2. Geração do token JWT.
3. Armazenamento do token pelo frontend.
4. Envio automático do token no header Authorization.
5. Validação do token através do JwtFilter.
6. Autorização da requisição.

As rotas públicas atualmente são:

- /auth/register
- /auth/login
- /auth/forgot-password
- /auth/reset-password

As demais rotas exigem autenticação.

---

# Recuperação de Senha

O sistema possui recuperação de senha integrada utilizando e-mail.

Fluxo:

1. Usuário informa o e-mail.
2. É gerado um token único.
3. O token é armazenado na tabela:

```
password_reset_tokens
```

4. Um e-mail HTML é enviado ao usuário.
5. O usuário redefine sua senha.
6. O token é marcado como utilizado.

Cada token possui:

- usuário associado
- data de expiração
- status de utilização

---

# Envio de E-mails

O envio de e-mails é realizado utilizando:

- Spring Boot Starter Mail
- JavaMailSender
- Thymeleaf

Os templates HTML encontram-se em:

```
src/main/resources/templates/mail
```

O serviço responsável pelo envio é:

```
EmailService
```

---

# Variáveis de Configuração

As configurações são realizadas através do arquivo:

```
application.properties
```

Principais propriedades utilizadas:

```properties
spring.datasource.url=
spring.datasource.username=
spring.datasource.password=

jwt.secret=
jwt.expiration=

spring.mail.host=
spring.mail.port=
spring.mail.username=
spring.mail.password=
```

O arquivo deve ser configurado conforme o ambiente de execução.

---

# Instalação

Clone o projeto:

```bash
git clone https://github.com/GabrielLucim/controle-financeiro.git
```

Entre na pasta:

```bash
cd controle-financeiro/backend
```

Instale as dependências:

```bash
mvn clean install
```

---

# Configuração do Banco de Dados

Antes de executar a aplicação, crie um banco de dados MySQL chamado:

```sql
CREATE DATABASE fincontrol;
```

Em seguida, configure as credenciais no arquivo:

```
src/main/resources/application.properties
```

Exemplo:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/fincontrol
spring.datasource.username=root
spring.datasource.password=
```

O Hibernate será responsável pela criação e atualização automática das tabelas.

---

# Configuração de JWT

O sistema utiliza autenticação baseada em JSON Web Token (JWT).

Configure as propriedades:

```properties
jwt.secret=SuaChaveSecretaComPeloMenos256Bits
jwt.expiration=86400000
```

Onde:

- **jwt.secret** é a chave utilizada para assinatura dos tokens.
- **jwt.expiration** representa o tempo de expiração do token em milissegundos.

---

# Configuração do Serviço de E-mail

Para utilização da funcionalidade de recuperação de senha é necessário configurar uma conta SMTP.

Exemplo utilizando Gmail:

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=seu-email@gmail.com
spring.mail.password=sua-senha-de-aplicativo

spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

A senha utilizada deve ser uma **Senha de Aplicativo** gerada após habilitar a autenticação em duas etapas da conta Google.

---

# Executando a Aplicação

Com todas as configurações realizadas, execute:

```bash
mvn spring-boot:run
```

Ou diretamente pela IDE (IntelliJ IDEA ou Visual Studio Code).

A API será disponibilizada em:

```
http://localhost:8080
```

---

# Integração com o Frontend

O frontend comunica-se diretamente com esta API através do Axios.

Após autenticação, o token JWT é enviado automaticamente em todas as requisições protegidas utilizando o header:

```http
Authorization: Bearer <token>
```

A configuração de CORS permite o acesso da aplicação React durante o desenvolvimento.

---

# Endpoints Implementados

## Autenticação

```
POST   /auth/register
POST   /auth/login
POST   /auth/forgot-password
POST   /auth/reset-password
```

---

## Dashboard

```
GET    /dashboard
```

---

## Carteiras

```
POST   /wallets
GET    /wallets
GET    /wallets/{id}
PUT    /wallets/{id}
DELETE /wallets/{id}
```

---

## Demais Recursos

O projeto também possui estrutura preparada para gerenciamento de:

- Usuários
- Categorias
- Transações

Esses recursos seguem a mesma arquitetura em camadas utilizada nas demais funcionalidades.

---

# Decisões de Projeto

Durante o desenvolvimento foram adotadas algumas decisões visando organização e manutenção do sistema:

- Utilização de arquitetura em camadas (Controller → Service → Repository).
- Separação entre entidades e objetos de transferência (DTOs).
- Utilização do Spring Security para controle de autenticação.
- Autenticação baseada em JWT para comunicação stateless.
- Utilização do JavaMailSender para envio de e-mails.
- Utilização do Thymeleaf para geração de templates HTML de e-mail.
- Persistência dos tokens de recuperação de senha em banco de dados, permitindo controle de expiração e reutilização.
- Utilização do Spring Data JPA para abstração da camada de acesso aos dados.
- Mapeamento de relacionamentos entre entidades utilizando JPA/Hibernate.

---

# Dependências Principais

As principais dependências utilizadas no projeto são:

- Spring Boot Starter Web
- Spring Boot Starter Security
- Spring Boot Starter Data JPA
- Spring Boot Starter Validation
- Spring Boot Starter Mail
- Spring Boot Starter Thymeleaf
- MySQL Connector
- Lombok
- JJWT

---

# Documentação da API

Atualmente o projeto **não possui integração com Swagger/OpenAPI**.

Os endpoints podem ser testados utilizando ferramentas como:

- Postman
- Insomnia
- Thunder Client (VS Code)

---

# Autor

**Gabriel Dos Anjos Lucim**

Instituto Federal do Paraná — IFPR

Curso de Engenharia de Software

Disciplina de Engenharia de Software