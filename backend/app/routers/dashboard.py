from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/resumo", response_model=schemas.DashboardResumo)
def resumo_geral(db: Session = Depends(get_db)):
    """Cards de resumo: valor investido em estoque e faturamento estimado."""
    produtos = db.query(models.Produto).all()

    valor_total_estoque = sum(
        p.preco_custo * p.quantidade_estoque for p in produtos
    )
    faturamento_estimado = sum(
        p.preco_venda * p.quantidade_estoque for p in produtos
    )

    return schemas.DashboardResumo(
        valor_total_estoque=round(valor_total_estoque, 2),
        faturamento_estimado=round(faturamento_estimado, 2),
        total_produtos=len(produtos),
    )


@router.get("/estoque-baixo", response_model=List[schemas.Produto])
def produtos_estoque_baixo(db: Session = Depends(get_db)):
    """Produtos cuja quantidade em estoque está no limite mínimo ou abaixo dele."""
    return (
        db.query(models.Produto)
        .filter(models.Produto.quantidade_estoque <= models.Produto.estoque_minimo)
        .all()
    )


@router.get("/top-vendidos", response_model=List[schemas.ProdutoMaisVendido])
def top_produtos_vendidos(limite: int = 5, db: Session = Depends(get_db)):
    """
    Top produtos por quantidade total vendida (soma de saídas).
    Baseado no histórico real de movimentações, não no estoque atual.
    """
    resultado = (
        db.query(
            models.Produto.id,
            models.Produto.nome,
            func.sum(models.MovimentacaoEstoque.quantidade).label("total_vendido"),
        )
        .join(
            models.MovimentacaoEstoque,
            models.MovimentacaoEstoque.produto_id == models.Produto.id,
        )
        .filter(models.MovimentacaoEstoque.tipo == models.TipoMovimentacao.SAIDA)
        .group_by(models.Produto.id)
        .order_by(func.sum(models.MovimentacaoEstoque.quantidade).desc())
        .limit(limite)
        .all()
    )

    return [
        schemas.ProdutoMaisVendido(
            produto_id=r.id, nome=r.nome, total_vendido=r.total_vendido
        )
        for r in resultado
    ]
