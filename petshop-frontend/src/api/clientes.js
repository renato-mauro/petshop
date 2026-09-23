// Funções que conversam com a API do petshop (veja o projeto petshop-api).
//
// Usamos o "fetch", que já vem pronto no navegador — não precisa instalar
// nenhuma biblioteca extra para fazer requisições HTTP.
//
// Graças ao proxy configurado em vite.config.js, "/api/clientes" é
// redirecionado automaticamente para http://localhost:3001/api/clientes.

const BASE_URL = '/api/clientes';

// Busca a lista de todos os clientes cadastrados.
export async function listarClientes() {
  const resposta = await fetch(BASE_URL);
  if (!resposta.ok) {
    throw new Error('Não foi possível carregar os clientes.');
  }
  return resposta.json();
}

// Busca um único cliente pelo id_cliente (usado na página de edição).
export async function buscarCliente(id) {
  const resposta = await fetch(`${BASE_URL}/${id}`);
  if (!resposta.ok) {
    throw new Error('Cliente não encontrado.');
  }
  return resposta.json();
}

// Cria um novo cliente. "dados" é um objeto com os campos do formulário.
export async function criarCliente(dados) {
  const resposta = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) {
    throw new Error('Não foi possível cadastrar o cliente.');
  }
  return resposta.json();
}

// Atualiza um cliente já existente, identificado pelo id_cliente.
export async function atualizarCliente(id, dados) {
  const resposta = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) {
    throw new Error('Não foi possível atualizar o cliente.');
  }
  return resposta.json();
}

// Remove um cliente pelo id_cliente.
export async function removerCliente(id) {
  const resposta = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!resposta.ok) {
    throw new Error('Não foi possível remover o cliente.');
  }
}

// ---------------------------------------------------------------------
// PONTO DE EXERCÍCIO
// ---------------------------------------------------------------------
// Para o cadastro de "serviços oferecidos", crie um arquivo parecido,
// por exemplo "src/api/servicos.js", copiando estas mesmas cinco
// funções e trocando BASE_URL para '/api/servicos'.
// ---------------------------------------------------------------------
