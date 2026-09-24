# 📦 Estoque Dashboard

Sistema de gerenciamento de estoque e catálogo de produtos com dashboard de vendas, desenvolvido com **FastAPI** no back-end e **React** no front-end.

O projeto simula uma necessidade real de pequenos negócios: cadastrar produtos, controlar entradas e saídas de estoque, e visualizar métricas de negócio (valor investido, faturamento estimado, produtos em alerta e mais vendidos) em um dashboard interativo.

<!-- Adicione aqui um GIF ou print do dashboard e da tabela de produtos -->
<!-- ![Dashboard](./docs/dashboard.png) -->

## ✨ Funcionalidades

- **CRUD completo de produtos**: cadastro, listagem com busca por nome e filtro por categoria, edição e exclusão.
- **Controle de estoque**: registro de entradas (compras) e saídas (vendas), com validação para impedir venda de itens sem estoque suficiente.
- **Dashboard de métricas**:
  - Valor total investido em estoque
  - Faturamento estimado (se todo o estoque fosse vendido)
  - Lista de produtos com estoque abaixo do mínimo (alerta)
  - Top produtos mais vendidos (baseado no histórico real de vendas)
- **Tratamento de erros**: mensagens claras no front-end para situações como estoque insuficiente ou categoria inexistente.

## 🛠️ Tecnologias

**Back-end**
- [FastAPI](https://fastapi.tiangolo.com/) — framework web assíncrono com documentação automática (Swagger)
- [SQLAlchemy](https://www.sqlalchemy.org/) — ORM
- [SQLite](https://www.sqlite.org/) — banco de dados
- [Pydantic](https://docs.pydantic.dev/) — validação de dados

**Front-end**
- [React](https://react.dev/) (via [Vite](https://vitejs.dev/))
- [Recharts](https://recharts.org/) — gráficos
- [Axios](https://axios-http.com/) — cliente HTTP

## 📁 Estrutura do projeto

```
estoque-dashboard/
├── backend/
│   ├── app/
│   │   ├── main.py          # ponto de entrada da API
│   │   ├── database.py      # conexão com o banco
│   │   ├── models.py        # modelos SQLAlchemy (Produto, Categoria, MovimentacaoEstoque)
│   │   ├── schemas.py       # schemas Pydantic (validação de entrada/saída)
│   │   └── routers/         # rotas organizadas por domínio
│   │       ├── produtos.py
│   │       ├── categorias.py
│   │       ├── movimentacoes.py
│   │       └── dashboard.py
│   └── requirements.txt
└── frontend/
    └── src/
        ├── api/              # funções de comunicação com a API
        ├── components/       # componentes reutilizáveis (tabela, modal, formulários)
        └── pages/            # páginas (Dashboard, Produtos)
```

## 🚀 Como rodar localmente

### Pré-requisitos
- [Python 3.11+](https://www.python.org/downloads/)
- [Node.js LTS](https://nodejs.org/)

### Back-end

```bash
cd backend
python -m venv venv

# Ativar o ambiente virtual
venv\Scripts\activate      # Windows
source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
uvicorn app.main:app --reload
```

A API estará disponível em `http://localhost:8000`, com documentação interativa em `http://localhost:8000/docs`.

### Front-end

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

> ⚠️ O back-end precisa estar rodando para que o front-end consiga carregar os dados.

## 📌 Endpoints principais

| Método | Rota                      | Descrição                                  |
|--------|----------------------------|---------------------------------------------|
| GET    | `/produtos/`               | Lista produtos (com filtro por nome/categoria) |
| POST   | `/produtos/`                | Cadastra um novo produto                    |
| PUT    | `/produtos/{id}`            | Atualiza um produto                         |
| DELETE | `/produtos/{id}`            | Remove um produto                           |
| POST   | `/movimentacoes/`           | Registra entrada ou saída de estoque        |
| GET    | `/dashboard/resumo`         | Valor em estoque e faturamento estimado     |
| GET    | `/dashboard/estoque-baixo`  | Produtos abaixo do estoque mínimo           |
| GET    | `/dashboard/top-vendidos`   | Produtos mais vendidos                      |

A lista completa de rotas está disponível no Swagger (`/docs`) com o back-end rodando.

## 🔮 Próximos passos

- Autenticação (login único com JWT)
- Migrations com Alembic
- Testes automatizados com Pytest
- Paginação na listagem de produtos

## 📄 Licença

Este projeto é livre para fins de estudo e portfólio.
