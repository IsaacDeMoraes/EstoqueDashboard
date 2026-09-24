from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/movimentacoes", tags=["Movimentações de Estoque"])


@router.post("/", response_model=schemas.Movimentacao, status_code=201)
def registrar_movimentacao(
    dados: schemas.MovimentacaoCreate, db: Session = Depends(get_db)
):
    produto = db.query(models.Produto).filter(
        models.Produto.id == dados.produto_id
    ).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    if dados.quantidade <= 0:
        raise HTTPException(
            status_code=400, detail="Quantidade deve ser maior que zero"
        )

    if dados.tipo == models.TipoMovimentacao.SAIDA:
        if produto.quantidade_estoque < dados.quantidade:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Estoque insuficiente. Disponível: "
                    f"{produto.quantidade_estoque}, solicitado: {dados.quantidade}"
                ),
            )
        produto.quantidade_estoque -= dados.quantidade
    else:  # ENTRADA
        produto.quantidade_estoque += dados.quantidade

    nova_movimentacao = models.MovimentacaoEstoque(
        produto_id=dados.produto_id,
        tipo=dados.tipo,
        quantidade=dados.quantidade,
    )
    db.add(nova_movimentacao)
    # produto já está "sujo" (modificado) na sessão, o commit salva os dois juntos
    db.commit()
    db.refresh(nova_movimentacao)
    return nova_movimentacao


@router.get("/", response_model=List[schemas.Movimentacao])
def listar_movimentacoes(
    produto_id: Optional[int] = Query(None, description="Filtrar por produto"),
    db: Session = Depends(get_db),
):
    query = db.query(models.MovimentacaoEstoque)
    if produto_id is not None:
        query = query.filter(models.MovimentacaoEstoque.produto_id == produto_id)
    return query.order_by(models.MovimentacaoEstoque.data.desc()).all()
