from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from .models import TipoMovimentacao


# ---------- Categoria ----------
class CategoriaBase(BaseModel):
    nome: str


class CategoriaCreate(CategoriaBase):
    pass


class Categoria(CategoriaBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---------- Produto ----------
class ProdutoBase(BaseModel):
    nome: str
    categoria_id: Optional[int] = None
    preco_custo: float
    preco_venda: float
    estoque_minimo: int = 0


class ProdutoCreate(ProdutoBase):
    quantidade_estoque: int = 0


class ProdutoUpdate(BaseModel):
    nome: Optional[str] = None
    categoria_id: Optional[int] = None
    preco_custo: Optional[float] = None
    preco_venda: Optional[float] = None
    estoque_minimo: Optional[int] = None


class Produto(ProdutoBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    quantidade_estoque: int


# ---------- Movimentação ----------
class MovimentacaoCreate(BaseModel):
    produto_id: int
    tipo: TipoMovimentacao
    quantidade: int


class Movimentacao(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    produto_id: int
    tipo: TipoMovimentacao
    quantidade: int
    data: datetime


# ---------- Dashboard ----------
class DashboardResumo(BaseModel):
    valor_total_estoque: float
    faturamento_estimado: float
    total_produtos: int


class ProdutoMaisVendido(BaseModel):
    produto_id: int
    nome: str
    total_vendido: int
