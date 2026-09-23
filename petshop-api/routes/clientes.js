// Rotas do cadastro de clientes.
//
// Esse arquivo só cuida da tabela "clientes". Ele é "montado" em um
// endereço base (/api/clientes) lá em server.js, por isso as rotas aqui
// dentro começam em "/" (a lista) e "/:id" (um cliente específico), e não
// em "/api/clientes".

import { Router } from 'express';
import db from '../database.js';

const router = Router();

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
router.get('/', (req, res) => {
  const clientes = db
    .prepare('SELECT * FROM clientes ORDER BY id_cliente DESC')
    .all();
  res.json(clientes);
});

// GET /api/clientes/:id -> busca um único cliente
router.get('/:id', (req, res) => {
  const cliente = db
    .prepare('SELECT * FROM clientes WHERE id_cliente = ?')
    .get(req.params.id);

  if (!cliente) {
    return res.status(404).json({ erro: 'Cliente não encontrado.' });
  }
  res.json(cliente);
});

// POST /api/clientes -> cria um novo cliente
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  const resultado = db
    .prepare('DELETE FROM clientes WHERE id_cliente = ?')
    .run(req.params.id);

  if (resultado.changes === 0) {
    return res.status(404).json({ erro: 'Cliente não encontrado.' });
  }

  res.status(204).send();
});

export default router;
