# Anti-Social API

Bem-vindo ao repositório do **Anti-Social**, uma API backend desenvolvida em Node.js com TypeScript, focada em gerenciar interações sociais.

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando as seguintes tecnologias e bibliotecas:

- **[Node.js](https://nodejs.org/)** - Runtime JavaScript.
- **[Express](https://expressjs.com/)** - Framework web rápido e minimalista.
- **[TypeScript](https://www.typescriptlang.org/)** - Superset do JavaScript com tipagem estática.
- **[TypeORM](https://typeorm.io/)** - ORM para TypeScript e JavaScript (ES7, ES6, ES5).
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional robusto.
- **[Zod](https://zod.dev/)** - Validação de esquemas TypeScript-first.
- **[Jest](https://jestjs.io/)** - Framework de testes.
- **[Docker](https://www.docker.com/)** - Containerização da aplicação e banco de dados.
- **[Redis](https://redis.io/)** - Armazenamento de dados em memória.
- **[Nginx](https://nginx.org/)** - Servidor web e Load Balancer.
- **[pnpm](https://pnpm.io/)** - Gerenciador de pacotes rápido e eficiente.

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura distribuída e containerizada com Docker Compose:

- **Load Balancer (Nginx):** Recebe as requisições na porta `8081` e distribui entre as instâncias da API.
- **API (Node.js):** Executa em múltiplas réplicas (escalável) para processar as requisições.
- **Banco de Dados (PostgreSQL):** Armazena os dados persistentes.
- **Cache (Redis):** Utilizado para cache e gerenciamento de sessões.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (v18 ou superior recomendado)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/) e Docker Compose

## 🔧 Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/JPCabral04/anti-social.git
   cd anti-social
   ```

2. **Instale as dependências:**

   ```bash
   pnpm install
   ```

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto com base nas variáveis utilizadas no `docker-compose.yml` e `src/data-source.ts`. Exemplo:

```env
# Configurações do Banco de Dados (Docker)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB_NAME=anti_social_db
POSTGRES_DB_TEST=anti_social_test_db

# URLs de Conexão TypeORM
# Porta 5434 mapeada no docker-compose para o banco principal
DATABASE_URL=postgres://postgres:postgres@localhost:5434/anti_social_db

# Porta 5433 mapeada no docker-compose para o banco de testes
DATABASE_URL_TEST=postgres://postgres:postgres@localhost:5433/anti_social_test_db

# Outras configurações (ex: JWT Secret, Porta da API)
PORT=3000
JWT_SECRET=seu_segredo_super_seguro
```

> **Nota:** Para testes, o projeto procura por um arquivo `.env.test.local` se `NODE_ENV=test`.

### ⚠️ Configuração de Testes (.env.test.local)

Para rodar os testes, o sistema busca automaticamente por um arquivo `.env.test.local`. Certifique-se de criá-lo com as credenciais corretas para o banco de testes.

**Atenção:** É fundamental que o **banco de dados de teste exista** antes da execução dos testes.
Caso o container Docker não o crie automaticamente ou você esteja usando um banco local, **crie o banco de dados manualmente** (ex: `anti_social_test_db`) utilizando o pgAdmin, DBeaver ou via linha de comando (`CREATE DATABASE ...`). Sem isso, os testes não conseguirão conectar e falharão.

## 🐳 Executando com Docker Compose

O projeto utiliza o Docker Compose para subir todo o ambiente (Banco de Dados, Redis, API e Load Balancer).

Para iniciar a aplicação com 3 réplicas da API e Load Balancer:

```bash
docker-compose up --build --scale api=3
```

Isso iniciará:

- **Load Balancer (Nginx)**: Acessível em `http://localhost:8081`.
- **API**: 3 instâncias rodando internamente.
- **anti_social**: Banco principal na porta `5434`.
- **postgres_test**: Banco de testes na porta `5433`.
- **redis**: Serviço de cache na porta `6379`.

## ▶️ Executando Localmente (Desenvolvimento)

### Desenvolvimento

Para rodar a aplicação localmente em modo de desenvolvimento (sem Docker para a API, apenas para os serviços):

1. Suba os serviços de infraestrutura:

   ```bash
   docker-compose up -d anti_social postgres_test redis
   ```

2. Inicie a aplicação:
   ```bash
   pnpm dev
   ```

### Produção

Para buildar e rodar a versão compilada:

```bash
pnpm build
pnpm start
```

## 🧪 Testes

O projeto utiliza Jest para testes automatizados.

- **Rodar todos os testes:**

  ```bash
  pnpm test
  ```

- **Rodar testes com cobertura (coverage):**
  ```bash
  pnpm test:coverage
  ```

## 🛠️ Scripts Disponíveis

- `pnpm dev`: Inicia o servidor de desenvolvimento.
- `pnpm build`: Compila o TypeScript para JavaScript na pasta `dist`.
- `pnpm start`: Inicia o servidor a partir da pasta `dist`.
- `pnpm lint`: Executa o ESLint para verificar problemas no código.
- `pnpm format`: Formata o código usando Prettier.
- `pnpm check`: Executa lint e format em sequência.

## 📂 Estrutura do Projeto

```
src/
├── @types/         # Definições de tipos customizados
├── __tests__/      # Testes de integração/unitários
├── controllers/    # Controladores da API (Lógica de entrada/saída)
├── entities/       # Entidades do TypeORM (Modelos do Banco)
├── middlewares/    # Middlewares do Express (Auth, Error Handling, etc)
├── routes/         # Definições das rotas da API
├── schemas/        # Schemas de validação Zod
├── services/       # Regras de negócio
├── app.ts          # Configuração do Express
├── data-source.ts  # Configuração do TypeORM
└── index.ts        # Ponto de entrada da aplicação
```

## 📡 Endpoints Principais

A API expõe os seguintes prefixos de rota:

- `/auth` - Autenticação e registro.
- `/users` - Gerenciamento de usuários.
- `/activities` - Gerenciamento de atividades.
- `/incentives` - Gerenciamento de incentivos.
- `/connections` - Gerenciamento de conexões entre usuários.

---

Desenvolvido por [JPCabral04](https://github.com/JPCabral04).
