import { Link } from 'react-router-dom';

// Página inicial: um menu simples com um "card" do Bootstrap para cada
// cadastro do sistema. Para adicionar um novo cadastro (ver exercício no
// README), basta copiar um dos blocos <Link>...</Link> abaixo e trocar o
// "to", o título e a descrição.
function Home() {
  return (
    <div className="container py-4">
      <h1 className="mb-4">🐾 Petshop</h1>

      <div className="row g-4">
        <div className="col-md-6">
          <Link to="/clientes" className="text-decoration-none text-reset">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h2 className="h5 card-title">Clientes</h2>
                <p className="card-text text-muted">
                  Cadastro de clientes e dos pets do petshop.
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-6">
          <Link to="/servicos" className="text-decoration-none text-reset">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h2 className="h5 card-title">Serviços</h2>
                <p className="card-text text-muted">
                  Serviços oferecidos pelo petshop (banho, tosa, etc.).
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
