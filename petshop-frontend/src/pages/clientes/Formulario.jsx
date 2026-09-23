import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ClienteForm from '../../components/ClienteForm';
import { buscarCliente, criarCliente, atualizarCliente } from '../../api/clientes';

// Página de cadastro/edição de um cliente.
//
// A mesma página serve para os dois casos:
// - /clientes/novo          -> não tem ":id" na rota, então é criação
// - /clientes/:id/editar     -> tem ":id" na rota, então é edição
function ClienteFormulario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const modoEdicao = Boolean(id);

  // Na criação já começamos com um objeto vazio (o ClienteForm preenche os
  // valores padrão). Na edição começamos com "null" até a API responder.
  const [valoresIniciais, setValoresIniciais] = useState(modoEdicao ? null : {});
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!modoEdicao) return;

    async function carregarCliente() {
      try {
        const cliente = await buscarCliente(id);
        setValoresIniciais(cliente);
      } catch {
        setErro('Não foi possível carregar este cliente.');
      }
    }
    carregarCliente();
  }, [id, modoEdicao]);

  async function handleSalvar(dados) {
    try {
      setErro('');
      if (modoEdicao) {
        await atualizarCliente(id, dados);
      } else {
        await criarCliente(dados);
      }
      navigate('/clientes');
    } catch {
      setErro('Não foi possível salvar o cliente.');
    }
  }

  return (
    <div className="container py-4">
      <Link to="/clientes" className="btn btn-link ps-0 mb-3 text-decoration-none">
        ← Voltar para a lista
      </Link>

      <h1 className="mb-4">{modoEdicao ? 'Editar cliente' : 'Novo cliente'}</h1>

      {erro && (
        <div className="alert alert-danger" role="alert">
          {erro}
        </div>
      )}

      {!valoresIniciais && !erro && <p>Carregando...</p>}

      {valoresIniciais && (
        <ClienteForm
          valoresIniciais={valoresIniciais}
          modoEdicao={modoEdicao}
          aoSalvar={handleSalvar}
          aoCancelar={() => navigate('/clientes')}
        />
      )}
    </div>
  );
}

export default ClienteFormulario;
