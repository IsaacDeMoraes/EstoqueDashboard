import enum
from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey,
    DateTime,
    Enum as SqlEnum,
)
from sqlalchemy.orm import relationship

from .database import Base


class TipoMovimentacao(str, enum.Enum):
    ENTRADA = "entrada"
    SAIDA = "saida"


class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, unique=True, nullable=False, index=True)

    produtos = relationship("Produto", back_populates="categoria")


class Produto(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False, index=True)
    categoria_id = Column(Integer, ForeignKey("categorias.id"), nullable=True)
    preco_custo = Column(Float, nullable=False, default=0.0)
    preco_venda = Column(Float, nullable=False, default=0.0)
    quantidade_estoque = Column(Integer, nullable=False, default=0)
    estoque_minimo = Column(Integer, nullable=False, default=0)

    categoria = relationship("Categoria", back_populates="produtos")
    movimentacoes = relationship("MovimentacaoEstoque", back_populates="produto")


class MovimentacaoEstoque(Base):
    __tablename__ = "movimentacoes_estoque"

    id = Column(Integer, primary_key=True, index=True)
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=False)
    tipo = Column(SqlEnum(TipoMovimentacao), nullable=False)
    quantidade = Column(Integer, nullable=False)
    data = Column(DateTime, default=datetime.utcnow, nullable=False)

    produto = relationship("Produto", back_populates="movimentacoes")
