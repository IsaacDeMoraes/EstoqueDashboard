import { useState } from "react";

export default function FormularioMovimentacao({ produto, onSalvar, onCancelar }) {
  const [tipo, setTipo] = useState("entrada");
  const [quantidade, setQuantidade] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quantidade || Number(quantidade) <= 0) {
      setErro("Informe uma quantidade maior que zero");
      return;
    }

    setErro("");
    setSalvando(true);
    try {
      await onSalvar({
        produto_id: produto.id,
        tipo,
        quantidade: Number(quantidade),
      });
    } catch (err) {
      // O backend retorna 400 com detail="Estoque insuficiente. Disponível: X, solicitado: Y"
      setErro(
        err.response?.data?.detail ||
          "Erro ao registrar movimentação. Tente novamente."
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <p className="info-produto">
        <strong>{produto.nome}</strong> — estoque atual:{" "}
        <strong>{produto.quantidade_estoque}</strong>
      </p>

      {erro && <div className="mensagem-erro">{erro}</div>}

      <label>
        Tipo
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="entrada">Entrada (compra)</option>
          <option value="saida">Saída (venda)</option>
        </select>
      </label>

      <label>
        Quantidade
        <input
          type="number"
          min="1"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          autoFocus
        />
      </label>

      <div className="modal-acoes">
        <button type="button" onClick={onCancelar} disabled={salvando}>
          Cancelar
        </button>
        <button type="submit" className="btn-primario" disabled={salvando}>
          {salvando ? "Registrando..." : "Confirmar"}
        </button>
      </div>
    </form>
  );
}
