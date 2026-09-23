import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

// Valores padrão para os campos que a página de criação não informa.
const VALORES_PADRAO = {
  nome: '',
  telefone: '',
  tipo_pet: 'Cachorro',
  nome_pet: '',
  data_nascimento_pet: '',
  raca: '',
  cor: '',
};

// Formulário de cadastro/edição de clientes, usando a biblioteca
// react-hook-form para cuidar do estado dos campos e das validações,
// e classes do Bootstrap para o layout (grid, form-control, etc.).
//
// Esse componente não sabe se está criando ou editando: quem decide isso
// é a página que o usa (veja src/pages/clientes/Formulario.jsx), passando
// os valores iniciais e o que fazer ao salvar/cancelar.
function ClienteForm({ valoresIniciais, modoEdicao, aoSalvar, aoCancelar }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { ...VALORES_PADRAO, ...valoresIniciais } });

  // Se os valores iniciais chegarem depois (ex.: enquanto a página busca o
  // cliente na API), atualizamos o formulário assim que eles ficarem prontos.
  useEffect(() => {
    reset({ ...VALORES_PADRAO, ...valoresIniciais });
  }, [valoresIniciais, reset]);

  return (
    <form className="card" onSubmit={handleSubmit(aoSalvar)}>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="nome" className="form-label">
              Nome do cliente
            </label>
            <input
              id="nome"
              className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
              {...register('nome', { required: 'Informe o nome.' })}
            />
            {errors.nome && <div className="invalid-feedback">{errors.nome.message}</div>}
          </div>

          <div className="col-md-6">
            <label htmlFor="telefone" className="form-label">
              Telefone
            </label>
            <input
              id="telefone"
              placeholder="(11) 99999-9999"
              className={`form-control ${errors.telefone ? 'is-invalid' : ''}`}
              {...register('telefone', { required: 'Informe o telefone.' })}
            />
            {errors.telefone && (
              <div className="invalid-feedback">{errors.telefone.message}</div>
            )}
          </div>

          <div className="col-md-3">
            <label htmlFor="tipo_pet" className="form-label">
              Tipo de pet
            </label>
            <select id="tipo_pet" className="form-select" {...register('tipo_pet', { required: true })}>
              <option value="Cachorro">Cachorro</option>
              <option value="Gato">Gato</option>
              <option value="Ave">Ave</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="col-md-3">
            <label htmlFor="nome_pet" className="form-label">
              Nome do pet
            </label>
            <input
              id="nome_pet"
              className={`form-control ${errors.nome_pet ? 'is-invalid' : ''}`}
              {...register('nome_pet', { required: 'Informe o nome do pet.' })}
            />
            {errors.nome_pet && (
              <div className="invalid-feedback">{errors.nome_pet.message}</div>
            )}
          </div>

          <div className="col-md-3">
            <label htmlFor="data_nascimento_pet" className="form-label">
              Nascimento do pet
            </label>
            <input
              id="data_nascimento_pet"
              type="date"
              className="form-control"
              {...register('data_nascimento_pet')}
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="raca" className="form-label">
              Raça
            </label>
            <input id="raca" className="form-control" {...register('raca')} />
          </div>

          <div className="col-md-3">
            <label htmlFor="cor" className="form-label">
              Cor
            </label>
            <input id="cor" className="form-control" {...register('cor')} />
          </div>
        </div>

        <div className="mt-4 d-flex gap-2">
          <button type="submit" className="btn btn-success" disabled={isSubmitting}>
            {modoEdicao ? 'Salvar alterações' : 'Cadastrar'}
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={aoCancelar}>
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}

export default ClienteForm;
