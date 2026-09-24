import { useEffect, useState } from "react";
import TabelaProdutos from "../components/TabelaProdutos";
import Modal from "../components/Modal";
import FormularioProduto from "../components/FormularioProduto";
import FormularioMovimentacao from "../components/FormularioMovimentacao";
import {
  listarProdutos,
  listarCategorias,
  criarProduto,
  atualizarProduto,
  deletarProduto,
  registrarMovimentacao,
} from "../api/estoque";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Controle de qual modal está aberto: null | "novo" | { editar: produto } | { movimentar: produto }
  const [modal, setModal] = useState(null);

  const carregarProdutos = (filtro = {}) => {
    listarProdutos(filtro).then(setProdutos);
  };

  useEffect(() => {
    setCarregando(true);
    Promise.all([listarProdutos(), listarCategorias()])
      .then(([p, c]) => {
        setProdutos(p);
        setCategorias(c);
      })
      .finally(() => setCarregando(false));
  }, []);

  const fecharModal = () => setModal(null);

  const handleCriar = async (dados) => {
    await criarProduto(dados);
    carregarProdutos();
    fecharModal();
  };

  const handleEditar = async (dados) => {
    await atualizarProduto(modal.editar.id, dados);
    carregarProdutos();
    fecharModal();
  };

  const handleMovimentar = async (dados) => {
    await registrarMovimentacao(dados);
    carregarProdutos();
    fecharModal();
  };

  const handleExcluir = async (produto) => {
    if (!confirm(`Excluir "${produto.nome}"? Essa ação não pode ser desfeita.`)) {
      return;
    }
    await deletarProduto(produto.id);
    carregarProdutos();
  };

  if (carregando) return <p className="carregando">Carregando produtos...</p>;

  return (
    <div className="pagina-produtos">
      <div className="cabecalho-pagina">
        <h2>Produtos</h2>
        <button className="btn-primario" onClick={() => setModal("novo")}>
          + Novo Produto
        </button>
      </div>

      <TabelaProdutos
        produtos={produtos}
        categorias={categorias}
        onFiltrar={carregarProdutos}
        onEditar={(produto) => setModal({ editar: produto })}
        onExcluir={handleExcluir}
        onMovimentar={(produto) => setModal({ movimentar: produto })}
      />

      {modal === "novo" && (
        <Modal titulo="Novo Produto" onFechar={fecharModal}>
          <FormularioProduto
            categorias={categorias}
            onSalvar={handleCriar}
            onCancelar={fecharModal}
          />
        </Modal>
      )}

      {modal?.editar && (
        <Modal titulo="Editar Produto" onFechar={fecharModal}>
          <FormularioProduto
            categorias={categorias}
            produtoInicial={modal.editar}
            onSalvar={handleEditar}
            onCancelar={fecharModal}
          />
        </Modal>
      )}

      {modal?.movimentar && (
        <Modal titulo="Movimentar Estoque" onFechar={fecharModal}>
          <FormularioMovimentacao
            produto={modal.movimentar}
            onSalvar={handleMovimentar}
            onCancelar={fecharModal}
          />
        </Modal>
      )}
    </div>
  );
}
