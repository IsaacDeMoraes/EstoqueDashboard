import api from "./client";

// ---------- Categorias ----------
export const listarCategorias = () => api.get("/categorias/").then((r) => r.data);

export const criarCategoria = (nome) =>
  api.post("/categorias/", { nome }).then((r) => r.data);

// ---------- Produtos ----------
export const listarProdutos = ({ nome, categoria_id } = {}) =>
  api
    .get("/produtos/", { params: { nome, categoria_id } })
    .then((r) => r.data);

export const criarProduto = (produto) =>
  api.post("/produtos/", produto).then((r) => r.data);

export const atualizarProduto = (id, dados) =>
  api.put(`/produtos/${id}`, dados).then((r) => r.data);

export const deletarProduto = (id) => api.delete(`/produtos/${id}`);

// ---------- Movimentações ----------
export const registrarMovimentacao = (dados) =>
  api.post("/movimentacoes/", dados).then((r) => r.data);

export const listarMovimentacoes = (produto_id) =>
  api
    .get("/movimentacoes/", { params: { produto_id } })
    .then((r) => r.data);

// ---------- Dashboard ----------
export const buscarResumo = () =>
  api.get("/dashboard/resumo").then((r) => r.data);

export const buscarEstoqueBaixo = () =>
  api.get("/dashboard/estoque-baixo").then((r) => r.data);

export const buscarTopVendidos = (limite = 5) =>
  api
    .get("/dashboard/top-vendidos", { params: { limite } })
    .then((r) => r.data);
