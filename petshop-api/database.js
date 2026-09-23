// Conexão com o banco de dados SQLite e criação das tabelas.
//
// Usamos o pacote "better-sqlite3": ele é síncrono, ou seja, cada comando
// SQL roda e devolve o resultado na hora, sem precisar de "await".
// Isso deixa o código mais fácil de ler para quem está começando.

import Database from 'better-sqlite3';

// O banco fica salvo em um arquivo chamado "petshop.db" dentro desta pasta.
// Se o arquivo não existir, o better-sqlite3 cria ele automaticamente.
const db = new Database('petshop.db');

// Recomendação padrão do better-sqlite3 para melhorar performance e evitar
// problemas de acesso concorrente ao arquivo do banco.
db.pragma('journal_mode = WAL');

// Cria a tabela de clientes caso ela ainda não exista.
// "IF NOT EXISTS" evita erro quando o servidor é reiniciado várias vezes.
db.exec(`
  CREATE TABLE IF NOT EXISTS clientes (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    tipo_pet TEXT NOT NULL,
    nome_pet TEXT NOT NULL,
    data_nascimento_pet TEXT,
    raca TEXT,
    cor TEXT
  )
`);

// ---------------------------------------------------------------------
// PONTO DE EXERCÍCIO
// ---------------------------------------------------------------------
// Para criar um novo cadastro (por exemplo, "serviços oferecidos"),
// crie uma nova tabela aqui, seguindo o mesmo modelo acima. Exemplo:
//
// db.exec(`
//   CREATE TABLE IF NOT EXISTS servicos (
//     id_servico INTEGER PRIMARY KEY AUTOINCREMENT,
//     nome TEXT NOT NULL,
//     descricao TEXT,
//     preco REAL NOT NULL
//   )
// `);
// ---------------------------------------------------------------------

export default db;
