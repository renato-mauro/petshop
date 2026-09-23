# petshop-api

API REST feita com **Node.js + Express**, que guarda os dados em um banco
**SQLite** (usando o pacote [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3)).

Essa API não tem interface — ela só responde requisições HTTP com dados em
JSON. Quem consome ela é o projeto [`petshop-frontend`](../petshop-frontend),
mas você também pode testá-la sozinha com o navegador, `curl`, ou programas
como [Insomnia](https://insomnia.rest/) ou [Postman](https://www.postman.com/).

## Como rodar

```bash
npm install
npm run dev
```

O servidor sobe em **http://localhost:3001**. O arquivo `npm run dev` usa o
[`nodemon`](https://www.npmjs.com/package/nodemon), que reinicia o servidor
sozinho toda vez que você salva um arquivo — ótimo durante o desenvolvimento.

Se preferir rodar sem o reinício automático: `npm start`.

Na primeira execução, um arquivo `petshop.db` é criado automaticamente nesta
pasta — é o banco SQLite inteiro, guardado em um único arquivo. Ele **não**
deve ir para o Git (veja `.gitignore`): cada pessoa que clonar o projeto terá
o seu próprio banco, criado do zero.

## Estrutura do projeto

```
petshop-api/
├── database.js       -> conecta no SQLite e cria as tabelas
├── server.js         -> cria o servidor Express e monta as rotas de cada entidade
├── routes/
│   └── clientes.js    -> todas as rotas do cadastro de clientes
└── petshop.db        -> arquivo do banco de dados (criado automaticamente)
```

Cada entidade (cliente, serviço, etc.) tem seu **próprio arquivo de rotas**
dentro de `routes/`. Isso mantém o projeto organizado: para saber tudo que
existe sobre "clientes", basta abrir `routes/clientes.js` — sem precisar
misturar as rotas de entidades diferentes no mesmo arquivo.

## Como a API funciona (visão geral)

1. `database.js` abre (ou cria) o arquivo `petshop.db` e garante que a
   tabela `clientes` exista, rodando um comando `CREATE TABLE IF NOT EXISTS`.
2. `routes/clientes.js` cria um [`express.Router()`](https://expressjs.com/pt-br/guide/routing.html#roteador-de-express)
   — um "mini app" do Express — e registra nele uma rota para cada operação
   do CRUD (Create, Read, Update, Delete). Cada rota recebe a requisição
   (`req`), roda um comando SQL usando `db.prepare(...)`, e devolve uma
   resposta (`res`) em JSON.
3. `server.js` cria o servidor Express principal e "monta" esse router em um
   endereço base:

   ```js
   app.use('/api/clientes', clientesRouter);
   ```

   Ou seja: uma rota escrita como `router.get('/:id')` dentro de
   `routes/clientes.js` passa a responder, na prática, em
   `GET /api/clientes/:id`.
4. O pacote `cors` libera o acesso de outras origens (como o site rodando em
   `http://localhost:5173`), já que por padrão o navegador bloqueia
   requisições entre portas/domínios diferentes.

Não usamos nenhum ORM (como Prisma ou Sequelize) de propósito: os comandos
SQL ficam visíveis e explícitos no código, o que ajuda a entender o que está
realmente acontecendo no banco.

## Rotas disponíveis

Todas as rotas começam com `/api/clientes`. Todas recebem e devolvem JSON.

| Método   | Rota                 | O que faz                        |
|----------|-----------------------|-----------------------------------|
| `GET`    | `/api/clientes`       | Lista todos os clientes           |
| `GET`    | `/api/clientes/:id`   | Busca um cliente pelo id          |
| `POST`   | `/api/clientes`       | Cria um novo cliente              |
| `PUT`    | `/api/clientes/:id`   | Atualiza um cliente existente     |
| `DELETE` | `/api/clientes/:id`   | Remove um cliente                 |

### Campos de um cliente

| Campo                  | Tipo                    | Obrigatório | Observação                          |
|-------------------------|--------------------------|:-----------:|---------------------------------------|
| `id_cliente`             | número                   | gerado automaticamente | chave primária, criada pelo banco |
| `nome`                   | texto                    | sim         | nome do cliente                        |
| `telefone`               | texto                    | sim         | telefone de contato                    |
| `tipo_pet`                | texto                    | sim         | ex.: Cachorro, Gato, Ave, Outro        |
| `nome_pet`                | texto                    | sim         | nome do pet                            |
| `data_nascimento_pet`      | texto (`AAAA-MM-DD`)     | não         | data de nascimento do pet              |
| `raca`                   | texto                    | não         | raça do pet                            |
| `cor`                    | texto                    | não         | cor predominante do pet                |

### Exemplos com `curl`

**Listar clientes**

```bash
curl http://localhost:3001/api/clientes
```

**Criar um cliente**

```bash
curl -X POST http://localhost:3001/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
        "nome": "Maria Silva",
        "telefone": "11999999999",
        "tipo_pet": "Cachorro",
        "nome_pet": "Rex",
        "data_nascimento_pet": "2020-05-10",
        "raca": "Vira-lata",
        "cor": "Caramelo"
      }'
```

Resposta (`201 Created`):

```json
{
  "id_cliente": 1,
  "nome": "Maria Silva",
  "telefone": "11999999999",
  "tipo_pet": "Cachorro",
  "nome_pet": "Rex",
  "data_nascimento_pet": "2020-05-10",
  "raca": "Vira-lata",
  "cor": "Caramelo"
}
```

**Atualizar um cliente**

```bash
curl -X PUT http://localhost:3001/api/clientes/1 \
  -H "Content-Type: application/json" \
  -d '{
        "nome": "Maria Silva",
        "telefone": "11999999999",
        "tipo_pet": "Cachorro",
        "nome_pet": "Rex",
        "data_nascimento_pet": "2020-05-10",
        "raca": "Vira-lata",
        "cor": "Marrom"
      }'
```

**Remover um cliente**

```bash
curl -X DELETE http://localhost:3001/api/clientes/1
```

### Códigos de status usados

- `200 OK` — a requisição deu certo (listar, buscar, atualizar).
- `201 Created` — o cliente foi criado com sucesso.
- `204 No Content` — o cliente foi removido com sucesso (não há corpo na resposta).
- `400 Bad Request` — faltou algum campo obrigatório no corpo da requisição.
- `404 Not Found` — o `id_cliente` informado não existe.

## Exercício: adicionar o cadastro de "Serviços oferecidos"

O arquivo `database.js` tem um bloco de comentário marcado como
**PONTO DE EXERCÍCIO** mostrando onde criar a nova tabela, e `server.js` tem
outro mostrando onde montar o novo router. O passo a passo completo
(incluindo o lado do front-end) está no README do
[`petshop-frontend`](../petshop-frontend/README.md#exercício-crie-o-cadastro-de-serviços-oferecidos).

Resumo do lado da API:

1. Em `database.js`, crie a tabela `servicos` (por exemplo com os campos
   `id_servico`, `nome`, `descricao`, `preco`).
2. Crie `routes/servicos.js` copiando `routes/clientes.js` como modelo, e
   adapte os campos e os comandos SQL para a tabela `servicos`.
3. Em `server.js`, importe e monte o novo router:

   ```js
   import servicosRouter from './routes/servicos.js';
   app.use('/api/servicos', servicosRouter);
   ```

4. Teste as novas rotas com `curl` antes de ligar o front-end nelas.
