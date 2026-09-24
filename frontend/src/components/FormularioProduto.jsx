import { useState } from "react";

const VAZIO = {
  nome: "",
  categoria_id: "",
  preco_custo: "",
  preco_venda: "",
  quantidade_estoque: "",
  estoque_minimo: "",
};

export default function FormularioProduto({
  categorias,
  produtoInicial,
  onSalvar,
  onCancelar,
}) {
  const editando = Boolean(produtoInicial);
  const [dados, setDados] = useState(
    produtoInicial
      ? {
          nome: produtoInicial.nome,
          categoria_id: produtoInicial.categoria_id ?? "",
          preco_custo: produtoInicial.preco_custo,
          preco_venda: produtoInicial.preco_venda,
          quantidade_estoque: produtoInicial.quantidade_estoque,
          estoque_minimo: produtoInicial.estoque_minimo,
        }
      : VAZIO
  );
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const atualizarCampo = (campo, valor) =>
    setDados((d) => ({ ...d, [campo]: valor }));

  const validar = () => {
    if (!dados.nome.trim()) return "Nome é obrigatório";
    if (dados.preco_custo === "" || Number(dados.preco_custo) < 0)
      return "Preço de custo inválido";
    if (dados.preco_venda === "" || Number(dados.preco_venda) < 0)
      return "Preço de venda inválido";
    if (!editando && Number(dados.quantidade_estoque) < 0)
      return "Quantidade em estoque inválida";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mensagemErro = validar();
    if (mensagemErro) {
      setErro(mensagemErro);
      return;
    }

    setErro("");
    setSalvando(true);
    try {
      const payload = editando
        ? {
            nome: dados.nome,
            categoria_id: dados.categoria_id || null,
            preco_custo: Number(dados.preco_custo),
            preco_venda: Number(dados.preco_venda),
            estoque_minimo: Number(dados.estoque_minimo),
          }
        : {
            nome: dados.nome,
            categoria_id: dados.categoria_id || null,
            preco_custo: Number(dados.preco_custo),
            preco_venda: Number(dados.preco_venda),
            quantidade_estoque: Number(dados.quantidade_estoque),
            estoque_minimo: Number(dados.estoque_minimo),
          };
      await onSalvar(payload);
    } catch (err) {
      setErro(
        err.response?.data?.detail || "Erro ao salvar produto. Tente novamente."
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      {erro && <div className="mensagem-erro">{erro}</div>}

      <label>
        Nome
        <input
          type="text"
          value={dados.nome}
          onChange={(e) => atualizarCampo("nome", e.target.value)}
        />
      </label>

      <label>
        Categoria
        <select
          value={dados.categoria_id}
          onChange={(e) => atualizarCampo("categoria_id", e.target.value)}
        >
          <option value="">Sem categoria</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </label>

      <div className="campo-linha">
        <label>
          Preço de custo
          <input
            type="number"
            step="0.01"
            value={dados.preco_custo}
            onChange={(e) => atualizarCampo("preco_custo", e.target.value)}
          />
        </label>
        <label>
          Preço de venda
          <input
            type="number"
            step="0.01"
            value={dados.preco_venda}
            onChange={(e) => atualizarCampo("preco_venda", e.target.value)}
          />
        </label>
      </div>

      <div className="campo-linha">
        {!editando && (
          <label>
            Quantidade inicial
            <input
              type="number"
              value={dados.quantidade_estoque}
              onChange={(e) =>
                atualizarCampo("quantidade_estoque", e.target.value)
              }
            />
          </label>
        )}
        <label>
          Estoque mínimo
          <input
            type="number"
            value={dados.estoque_minimo}
            onChange={(e) => atualizarCampo("estoque_minimo", e.target.value)}
          />
        </label>
      </div>

      <div className="modal-acoes">
        <button type="button" onClick={onCancelar} disabled={salvando}>
          Cancelar
        </button>
        <button type="submit" className="btn-primario" disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
