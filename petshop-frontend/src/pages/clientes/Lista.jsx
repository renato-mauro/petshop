import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ClienteList from '../../components/ClienteList';
import { listarClientes, removerCliente } from '../../api/clientes';

// Página de listagem: mostra a tabela de clientes e um botão para ir até
// a página de cadastro (/clientes/novo). Editar um cliente também leva
// para outra página (/clientes/:id/editar) — veja ClienteList.jsx.
function ClientesLista() {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  async function carregarClientes() {
    try {
      setErro('');
      setCarregando(true);
      const dados = await listarClientes();
      setClientes(dados);
    } catch {
      setErro('Não foi possível carregar os clientes. A API está rodando?');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  async function handleRemover(id) {
    const confirmou = window.confirm('Tem certeza que deseja remover este cliente?');
    if (!confirmou) return;

    try {
      setErro('');
      await removerCliente(id);
      await carregarClientes();
    } catch {
      setErro('Não foi possível remover o cliente.');
    }
  }

  return (
    <div className="container py-4">
      <Link to="/" className="btn btn-link ps-0 mb-3 text-decoration-none">
        ← Voltar
      </Link>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">🐾 Clientes</h1>
        <Link to="/clientes/novo" className="btn btn-success">
          Novo cliente
        </Link>
      </div>

      {erro && (
        <div className="alert alert-danger" role="alert">
          {erro}
        </div>
      )}

      {carregando ? <p>Carregando...</p> : <ClienteList clientes={clientes} aoRemover={handleRemover} />}
    </div>
  );
}

export default ClientesLista;
