# petshop-frontend

Site em **React**, criado com [Vite](https://vite.dev/) e estilizado com
[Bootstrap](https://getbootstrap.com/), que consome a API do projeto
[`petshop-api`](../petshop-api) para cadastrar clientes de um petshop (e os
pets de cada um).

## Como rodar

Antes de tudo, a API precisa estar rodando (veja o README de
[`petshop-api`](../petshop-api/README.md)), pois é dela que os dados vêm.

```bash
npm install
npm run dev
```

O site sobe em **http://localhost:5173**.

## Estrutura do projeto

```
petshop-frontend/
├── index.html
├── vite.config.js         -> configuração do Vite (inclui o proxy da API)
└── src/
    ├── main.jsx            -> ponto de entrada do React (importa o CSS do Bootstrap)
    ├── App.jsx              -> define as rotas do site (React Router)
    ├── index.css             -> ajustes globais além do Bootstrap (hoje, quase vazio)
    ├── api/
    │   └── clientes.js       -> funções que chamam a API (fetch)
    ├── pages/
    │   ├── Home.jsx           -> página inicial, com um card de menu por cadastro
    │   ├── Servicos.jsx        -> página do cadastro de serviços (exercício, ainda vazia)
    │   └── clientes/
    │       ├── Lista.jsx        -> lista os clientes (rota /clientes)
    │       └── Formulario.jsx    -> cria ou edita um cliente (rotas /clientes/novo e /clientes/:id/editar)
    └── components/
        ├── ClienteForm.jsx   -> os campos do formulário (usado pela página Formulario.jsx)
        └── ClienteList.jsx    -> a tabela de clientes (usado pela página Lista.jsx)
```

Cada cadastro tem sua própria pasta dentro de `pages/` (ex.: `pages/clientes/`),
com uma página de **lista** e uma de **formulário**. Isso separa duas
responsabilidades que, no cadastro de clientes original, estavam misturadas
na mesma página: "ver os dados que já existem" e "criar/editar um registro".

## Como a navegação funciona

O site usa o [React Router](https://reactrouter.com/) (pacote
`react-router-dom`) para ter mais de uma página sem precisar recarregar o
navegador. As rotas ficam todas centralizadas em `App.jsx`:

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/clientes" element={<ClientesLista />} />
    <Route path="/clientes/novo" element={<ClienteFormulario />} />
    <Route path="/clientes/:id/editar" element={<ClienteFormulario />} />
    <Route path="/servicos" element={<Servicos />} />
  </Routes>
</BrowserRouter>
```

- `path` é o endereço que aparece na barra do navegador.
- `element` é o componente de página (de `src/pages/`) que é exibido nesse
  endereço.
- A troca de página acontece com o componente `<Link to="/clientes">`, em
  vez de um `<a href="...">` comum — assim o React Router troca só o
  conteúdo da página, sem recarregar o site inteiro.
- `:id` em `/clientes/:id/editar` é um **parâmetro de rota**: um pedaço
  variável do endereço (ex.: `/clientes/3/editar`). Dentro da página, o hook
  `useParams()` devolve esse valor (`{ id: '3' }`), que é usado para buscar
  os dados desse cliente na API.

Repare que **a mesma página** (`ClienteFormulario`) atende duas rotas
diferentes: `/clientes/novo` (sem `:id`) e `/clientes/:id/editar` (com
`:id`). Dentro do componente, `Boolean(id)` diz se estamos criando ou
editando — veja `src/pages/clientes/Formulario.jsx`.

Cada página tem um link para voltar: as páginas de nível superior (`Lista`,
`Servicos`) voltam para `/` (a Home), e o formulário volta para `/clientes`
(a lista), tanto no link "← Voltar" quanto no botão "Cancelar".

## Como o site conversa com a API

O arquivo `src/api/clientes.js` concentra todas as chamadas HTTP usando
`fetch` (a API nativa do navegador — não usamos `axios` nem nenhuma outra
biblioteca para isso). São 5 funções, uma para cada operação:

- `listarClientes()` → `GET /api/clientes` (usada na página de lista)
- `buscarCliente(id)` → `GET /api/clientes/:id` (usada na página de edição, para carregar os dados do cliente antes de mostrar o formulário)
- `criarCliente(dados)` → `POST /api/clientes`
- `atualizarCliente(id, dados)` → `PUT /api/clientes/:id`
- `removerCliente(id)` → `DELETE /api/clientes/:id`

Repare que o código nunca escreve `http://localhost:3001`. Em vez disso, ele
chama endereços relativos como `/api/clientes`. Isso funciona por causa do
**proxy** configurado em `vite.config.js`: durante o desenvolvimento, o Vite
redireciona toda requisição que começa com `/api` para
`http://localhost:3001` (onde a API está rodando). Essa é uma técnica comum
em projetos reais, e evita ter que lidar com configuração de CORS ou variáveis
de ambiente logo de cara.

## Como o Bootstrap é usado

O Bootstrap foi instalado como um pacote npm comum (`npm install bootstrap`)
e o CSS dele é importado uma única vez, em `src/main.jsx`:

```js
import 'bootstrap/dist/css/bootstrap.min.css'
```

A partir daí, ele funciona exatamente como em qualquer outro projeto HTML:
usamos as **classes prontas do Bootstrap** direto no `className` dos
elementos (`container`, `row`, `col-md-6`, `form-control`, `btn
btn-success`, `table table-striped`, `alert alert-danger`, etc.). Não
instalamos nenhuma biblioteca de componentes React para isso (como o
`react-bootstrap`) — os elementos continuam sendo `<div>`, `<input>`,
`<table>` normais, só que com as classes do Bootstrap aplicadas. Isso deixa
mais fácil aproveitar o que vocês já sabem de Bootstrap "puro" das aulas de
HTML/CSS.

Não importamos o JavaScript do Bootstrap (usado por componentes como modais,
dropdowns e navbars com menu retrátil), porque o site atual não precisa
disso. Se um exercício futuro precisar, basta adicionar em `main.jsx`:

```js
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
```

## Como o formulário funciona

`ClienteForm.jsx` (em `src/components/`) usa a biblioteca
[`react-hook-form`](https://react-hook-form.com/) para controlar os campos.
As ideias principais:

- `register('nome', { required: '...' })` conecta um campo `<input>` ao
  formulário e define uma regra de validação.
- `handleSubmit(aoSalvar)` só chama a função `aoSalvar` (recebida por prop)
  se todos os campos passarem na validação.
- `reset(...)` é usado para preencher o formulário assim que os
  `valoresIniciais` chegam — importante na edição, já que os dados do
  cliente só ficam prontos depois que a página `Formulario.jsx` busca eles
  na API.

O componente `ClienteForm` **não sabe** se está criando ou editando um
cliente — ele só recebe `valoresIniciais`, `modoEdicao` (só para o texto do
botão) e as funções `aoSalvar`/`aoCancelar`. Quem decide o que fazer com os
dados é a página `pages/clientes/Formulario.jsx`. Essa separação (página
"inteligente" que sabe buscar/salvar dados + componente "burro" que só
mostra campos) é uma prática comum em React.

## Fluxo de dados (resumo)

**Página de lista (`pages/clientes/Lista.jsx`):**

1. Guarda a lista de clientes em um estado (`useState`).
2. Ao abrir a página, `useEffect` chama `listarClientes()` e guarda o
   resultado nesse estado.
3. `ClienteList` recebe a lista via props e apenas exibe (não guarda estado
   próprio). O botão "Editar" de cada linha é um link para
   `/clientes/:id/editar`.
4. Ao remover um cliente, a página chama `removerCliente(id)` e, em
   seguida, busca a lista atualizada de novo.

**Página de formulário (`pages/clientes/Formulario.jsx`):**

1. Lê o `:id` da URL com `useParams()`. Se não houver `:id`, é uma criação;
   se houver, é uma edição.
2. Na edição, busca os dados desse cliente com `buscarCliente(id)` antes de
   mostrar o formulário.
3. Ao salvar, chama `criarCliente` ou `atualizarCliente` (dependendo do
   modo) e usa `useNavigate()` para voltar à página de lista (`/clientes`).

---

## Exercício: crie o cadastro de "Serviços oferecidos"

Agora que o cadastro de clientes está funcionando, o objetivo é repetir o
mesmo padrão para criar o cadastro de serviços oferecidos pelo petshop (ex.:
banho, tosa, consulta veterinária), com campos como `nome`, `descricao` e
`preco`.

A rota `/servicos` e a página `src/pages/Servicos.jsx` **já existem** —
acessíveis também pelo card "Serviços" na página inicial — só que hoje elas
só mostram um aviso de "Não implementada". A ideia é substituir essa página
única por duas páginas, seguindo exatamente o padrão de `pages/clientes/`:
uma de lista (`/servicos`) e uma de formulário (`/servicos/novo` e
`/servicos/:id/editar`).

Siga os pontos marcados com **`PONTO DE EXERCÍCIO`** no código
(`petshop-api/database.js`, `petshop-api/server.js` e `src/App.jsx`) como
guia, e o passo a passo abaixo:

### 1. Banco de dados (`petshop-api/database.js`)

Crie a tabela `servicos`, por exemplo:

```js
db.exec(`
  CREATE TABLE IF NOT EXISTS servicos (
    id_servico INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    preco REAL NOT NULL
  )
`);
```

### 2. Rotas da API (`petshop-api/server.js`)

Copie as 5 rotas de `clientes` (`GET`, `GET /:id`, `POST`, `PUT /:id`,
`DELETE /:id`) e adapte para `/api/servicos`, trocando os campos e o nome da
tabela. Teste com `curl` antes de seguir para o front-end.

### 3. Funções de API no front-end (`src/api/servicos.js`)

Crie um novo arquivo copiando `src/api/clientes.js` (as 5 funções,
incluindo `buscarServico`), trocando `BASE_URL` para `/api/servicos`.

### 4. Componente de formulário (`src/components/ServicoForm.jsx`)

Copie `ClienteForm.jsx` como base — inclusive as classes do Bootstrap
(`card`, `row g-3`, `form-label`, `form-control`, `btn btn-success`) já
vêm prontas. Troque os campos para `nome`, `descricao` e `preco` (dica:
para `preco`, use `type="number"` no `<input>` e a opção
`valueAsNumber: true` no `register`, assim o react-hook-form já devolve um
número em vez de texto).

### 5. Componente de lista (`src/components/ServicoList.jsx`)

Copie `ClienteList.jsx` como base (mantendo as classes `table`,
`table-striped`, etc.), trocando as colunas da tabela e o link de edição
para `/servicos/${servico.id_servico}/editar`.

### 6. Páginas (`src/pages/servicos/Lista.jsx` e `Formulario.jsx`)

Crie a pasta `src/pages/servicos/` e copie os dois arquivos de
`src/pages/clientes/` (`Lista.jsx` e `Formulario.jsx`) para dentro dela,
adaptando os nomes de funções/variáveis (`clientes` → `servicos`) e as
chamadas de API para usar `src/api/servicos.js`. Depois apague (ou
esvazie) `src/pages/Servicos.jsx`, que não será mais usado.

### 7. Rotas (`src/App.jsx`)

Troque a rota única `/servicos` pelas três rotas de serviços, seguindo o
mesmo padrão de clientes:

```jsx
<Route path="/servicos" element={<ServicosLista />} />
<Route path="/servicos/novo" element={<ServicoFormulario />} />
<Route path="/servicos/:id/editar" element={<ServicoFormulario />} />
```

### Checklist final

- [ ] Consigo criar um serviço pela página `/servicos/novo` e ele aparece
      na lista em `/servicos`.
- [ ] Consigo editar um serviço existente pela página
      `/servicos/:id/editar`.
- [ ] Consigo remover um serviço direto na lista.
- [ ] Os dados continuam salvos depois de recarregar a página (prova de que
      estão no banco, e não só na memória do React).
