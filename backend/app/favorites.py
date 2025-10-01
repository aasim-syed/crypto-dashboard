from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .database import get_db
from . import models, schemas
from .auth import get_current_user

router = APIRouter()

@router.get("", response_model=List[schemas.FavoriteOut], summary="List my favorites")
def list_favorites(
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.Favorite).filter(models.Favorite.user_id == user.id).all()

@router.post("/{coin_id}", summary="Add a favorite coin")
def add_favorite(
    coin_id: str,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    exists = db.query(models.Favorite).filter_by(user_id=user.id, coin_id=coin_id).first()
    if exists:
        return {"status": "exists"}
    fav = models.Favorite(user_id=user.id, coin_id=coin_id)
    db.add(fav)
    db.commit()
    return {"status": "ok"}

@router.delete("/{coin_id}", summary="Remove a favorite coin")
def remove_favorite(
    coin_id: str,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    fav = db.query(models.Favorite).filter_by(user_id=user.id, coin_id=coin_id).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(fav)
    db.commit()
    return {"status": "ok"}
