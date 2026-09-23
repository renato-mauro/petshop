// API do Petshop
// -----------------------------------------------------------------------
// Um servidor Express bem simples, com rotas REST para cadastrar clientes
// (e seus pets) em um banco de dados SQLite.
//
// Rotas disponíveis (veja também o README.md deste projeto):
//   GET    /api/clientes       -> lista todos os clientes
//   GET    /api/clientes/:id   -> busca um cliente pelo id
//   POST   /api/clientes       -> cria um novo cliente
//   PUT    /api/clientes/:id   -> atualiza um cliente existente
//   DELETE /api/clientes/:id   -> remove um cliente
// -----------------------------------------------------------------------

import express from 'express';
import cors from 'cors';
import db from './database.js';

const app = express();
const PORT = 3001;

// Permite que o front-end (rodando em outra porta) faça requisições a esta API.
app.use(cors());

// Faz o Express entender requisições com corpo em JSON (req.body).
app.use(express.json());

// Campos que toda requisição de criação/atualização de cliente precisa ter.
const CAMPOS_OBRIGATORIOS = ['nome', 'telefone', 'tipo_pet', 'nome_pet'];

// Confere se o corpo da requisição tem os campos obrigatórios preenchidos.
function validarCliente(dados) {
  for (const campo of CAMPOS_OBRIGATORIOS) {
    if (!dados[campo] || String(dados[campo]).trim() === '') {
      return `O campo "${campo}" é obrigatório.`;
    }
  }
  return null;
}

// GET /api/clientes -> lista todos os clientes, do mais recente para o mais antigo
app.get('/api/clientes', (req, res) => {
  const clientes = db
    .prepare('SELECT * FROM clientes ORDER BY id_cliente DESC')
    .all();
  res.json(clientes);
});

// GET /api/clientes/:id -> busca um único cliente
app.get('/api/clientes/:id', (req, res) => {
  const cliente = db
    .prepare('SELECT * FROM clientes WHERE id_cliente = ?')
    .get(req.params.id);

  if (!cliente) {
    return res.status(404).json({ erro: 'Cliente não encontrado.' });
  }
  res.json(cliente);
});

// POST /api/clientes -> cria um novo cliente
app.post('/api/clientes', (req, res) => {
  const erro = validarCliente(req.body);
  if (erro) {
    return res.status(400).json({ erro });
  }

  const { nome, telefone, tipo_pet, nome_pet, data_nascimento_pet, raca, cor } =
    req.body;

  const resultado = db
    .prepare(
      `INSERT INTO clientes
        (nome, telefone, tipo_pet, nome_pet, data_nascimento_pet, raca, cor)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(nome, telefone, tipo_pet, nome_pet, data_nascimento_pet, raca, cor);

  const novoCliente = db
    .prepare('SELECT * FROM clientes WHERE id_cliente = ?')
    .get(resultado.lastInsertRowid);

  res.status(201).json(novoCliente);
});

// PUT /api/clientes/:id -> atualiza um cliente existente
app.put('/api/clientes/:id', (req, res) => {
  const erro = validarCliente(req.body);
  if (erro) {
    return res.status(400).json({ erro });
  }

  const clienteExistente = db
    .prepare('SELECT * FROM clientes WHERE id_cliente = ?')
    .get(req.params.id);

  if (!clienteExistente) {
    return res.status(404).json({ erro: 'Cliente não encontrado.' });
  }

  const { nome, telefone, tipo_pet, nome_pet, data_nascimento_pet, raca, cor } =
    req.body;

  db.prepare(
    `UPDATE clientes SET
       nome = ?, telefone = ?, tipo_pet = ?, nome_pet = ?,
       data_nascimento_pet = ?, raca = ?, cor = ?
     WHERE id_cliente = ?`
  ).run(nome, telefone, tipo_pet, nome_pet, data_nascimento_pet, raca, cor, req.params.id);

  const clienteAtualizado = db
    .prepare('SELECT * FROM clientes WHERE id_cliente = ?')
    .get(req.params.id);

  res.json(clienteAtualizado);
});

// DELETE /api/clientes/:id -> remove um cliente
app.delete('/api/clientes/:id', (req, res) => {
  const resultado = db
    .prepare('DELETE FROM clientes WHERE id_cliente = ?')
    .run(req.params.id);

  if (resultado.changes === 0) {
    return res.status(404).json({ erro: 'Cliente não encontrado.' });
  }

  res.status(204).send();
});

// -------------------------------------------------------------------------
// PONTO DE EXERCÍCIO
// -------------------------------------------------------------------------
// Para criar o cadastro de "serviços oferecidos" (ou qualquer outro
// cadastro novo), copie o bloco de rotas dos clientes acima e adapte:
//
//   app.get('/api/servicos', ...)
//   app.get('/api/servicos/:id', ...)
//   app.post('/api/servicos', ...)
//   app.put('/api/servicos/:id', ...)
//   app.delete('/api/servicos/:id', ...)
//
// Não esqueça de criar a tabela "servicos" em database.js antes!
// -------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`API do petshop rodando em http://localhost:${PORT}`);
});
