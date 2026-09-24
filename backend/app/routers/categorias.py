from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/categorias", tags=["Categorias"])


@router.post("/", response_model=schemas.Categoria, status_code=201)
def criar_categoria(categoria: schemas.CategoriaCreate, db: Session = Depends(get_db)):
    existente = db.query(models.Categoria).filter(
        models.Categoria.nome == categoria.nome
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Categoria já existe")

    nova_categoria = models.Categoria(**categoria.model_dump())
    db.add(nova_categoria)
    db.commit()
    db.refresh(nova_categoria)
    return nova_categoria


@router.get("/", response_model=List[schemas.Categoria])
def listar_categorias(db: Session = Depends(get_db)):
    return db.query(models.Categoria).all()


@router.delete("/{categoria_id}", status_code=204)
def deletar_categoria(categoria_id: int, db: Session = Depends(get_db)):
    categoria = db.query(models.Categoria).filter(
        models.Categoria.id == categoria_id
    ).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")

    db.delete(categoria)
    db.commit()
    return None
