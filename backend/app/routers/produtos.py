from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/produtos", tags=["Produtos"])


@router.post("/", response_model=schemas.Produto, status_code=201)
def criar_produto(produto: schemas.ProdutoCreate, db: Session = Depends(get_db)):
    if produto.categoria_id is not None:
        categoria = db.query(models.Categoria).filter(
            models.Categoria.id == produto.categoria_id
        ).first()
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoria não encontrada")

    novo_produto = models.Produto(**produto.model_dump())
    db.add(novo_produto)
    db.commit()
    db.refresh(novo_produto)
    return novo_produto


@router.get("/", response_model=List[schemas.Produto])
def listar_produtos(
    nome: Optional[str] = Query(None, description="Filtrar por nome (busca parcial)"),
    categoria_id: Optional[int] = Query(None, description="Filtrar por categoria"),
    db: Session = Depends(get_db),
):
    query = db.query(models.Produto)

    if nome:
        query = query.filter(models.Produto.nome.ilike(f"%{nome}%"))
    if categoria_id is not None:
        query = query.filter(models.Produto.categoria_id == categoria_id)

    return query.all()


@router.get("/{produto_id}", response_model=schemas.Produto)
def buscar_produto(produto_id: int, db: Session = Depends(get_db)):
    produto = db.query(models.Produto).filter(models.Produto.id == produto_id).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return produto


@router.put("/{produto_id}", response_model=schemas.Produto)
def atualizar_produto(
    produto_id: int, dados: schemas.ProdutoUpdate, db: Session = Depends(get_db)
):
    produto = db.query(models.Produto).filter(models.Produto.id == produto_id).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    # Só atualiza os campos que vieram preenchidos na requisição
    dados_atualizados = dados.model_dump(exclude_unset=True)
    for campo, valor in dados_atualizados.items():
        setattr(produto, campo, valor)

    db.commit()
    db.refresh(produto)
    return produto


@router.delete("/{produto_id}", status_code=204)
def deletar_produto(produto_id: int, db: Session = Depends(get_db)):
    produto = db.query(models.Produto).filter(models.Produto.id == produto_id).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    db.delete(produto)
    db.commit()
    return None
