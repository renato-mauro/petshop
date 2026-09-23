import { Link } from 'react-router-dom';

// Página do cadastro de "Serviços oferecidos" — ainda não implementada.
// Esse é o ponto de partida do exercício: veja o passo a passo em
// README.md ("Exercício: crie o cadastro de Serviços oferecidos").
function Servicos() {
  return (
    <div className="container py-4">
      <Link to="/" className="btn btn-link ps-0 mb-3 text-decoration-none">
        ← Voltar
      </Link>

      <h1 className="mb-4">🐾 Serviços</h1>

      <div className="alert alert-warning" role="alert">
        Não implementada. Esse cadastro é o exercício proposto — veja o
        passo a passo no <code>README.md</code> do projeto.
      </div>
    </div>
  );
}

export default Servicos;
