from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import engine
from .routers import produtos, categorias, movimentacoes, dashboard

# Cria as tabelas no banco se ainda não existirem.
# Em produção isso seria trocado por migrations (Alembic), mas pra começar já resolve.
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Estoque Dashboard API")

# Libera o front-end (rodando em outra porta, ex: localhost:5173) a chamar a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "mensagem": "API do Estoque Dashboard rodando"}


app.include_router(categorias.router)
app.include_router(produtos.router)
app.include_router(movimentacoes.router)
app.include_router(dashboard.router)
