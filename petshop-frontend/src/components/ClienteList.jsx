import { Link } from 'react-router-dom';

// Tabela com os clientes cadastrados e os botões de editar/remover.
// "table-responsive" faz a tabela rolar na horizontal em telas pequenas,
// em vez de quebrar o layout.
function ClienteList({ clientes, aoRemover }) {
  if (clientes.length === 0) {
    return <p>Nenhum cliente cadastrado ainda.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Telefone</th>
            <th>Pet</th>
            <th>Tipo</th>
            <th>Raça</th>
            <th>Cor</th>
            <th>Nascimento</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id_cliente}>
              <td>{cliente.nome}</td>
              <td>{cliente.telefone}</td>
              <td>{cliente.nome_pet}</td>
              <td>{cliente.tipo_pet}</td>
              <td>{cliente.raca}</td>
              <td>{cliente.cor}</td>
              <td>{cliente.data_nascimento_pet}</td>
              <td className="text-nowrap">
                <Link
                  to={`/clientes/${cliente.id_cliente}/editar`}
                  className="btn btn-sm btn-outline-primary me-2"
                >
                  Editar
                </Link>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => aoRemover(cliente.id_cliente)}
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClienteList;
