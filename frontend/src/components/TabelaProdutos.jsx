import { useState } from "react";

export default function TabelaProdutos({
  produtos,
  categorias,
  onFiltrar,
  onEditar,
  onExcluir,
  onMovimentar,
}) {
  const [nome, setNome] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  const aplicarFiltro = () => {
    onFiltrar({ nome, categoria_id: categoriaId || undefined });
  };

  return (
    <div className="tabela-container">
      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && aplicarFiltro()}
        />
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
        <button onClick={aplicarFiltro}>Filtrar</button>
      </div>

      <table className="tabela-produtos">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Preço Custo</th>
            <th>Preço Venda</th>
            <th>Estoque</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.length === 0 && (
            <tr>
              <td colSpan={6} className="vazio">
                Nenhum produto encontrado.
              </td>
            </tr>
          )}
          {produtos.map((p) => {
            const categoria = categorias.find((c) => c.id === p.categoria_id);
            const alerta = p.quantidade_estoque <= p.estoque_minimo;
            return (
              <tr key={p.id} className={alerta ? "linha-alerta" : ""}>
                <td>{p.nome}</td>
                <td>{categoria ? categoria.nome : "-"}</td>
                <td>R$ {p.preco_custo.toFixed(2)}</td>
                <td>R$ {p.preco_venda.toFixed(2)}</td>
                <td>
                  {p.quantidade_estoque}
                  {alerta && <span className="badge-alerta">baixo</span>}
                </td>
                <td className="acoes">
                  <button onClick={() => onMovimentar(p)}>Movimentar</button>
                  <button onClick={() => onEditar(p)}>Editar</button>
                  <button className="btn-perigo" onClick={() => onExcluir(p)}>
                    Excluir
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
