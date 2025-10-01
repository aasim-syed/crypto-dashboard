import os
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.hash import pbkdf2_sha256
from sqlalchemy.orm import Session

from .database import get_db
from . import models, schemas

router = APIRouter()

# JWT setup
SECRET_KEY = os.getenv("JWT_SECRET", "dev-secret-change-me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_TTL_MINUTES", "60"))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def create_access_token(sub: str) -> str:
    payload = {
        "sub": sub,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> models.User:
    cred_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials"
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if not username:
            raise cred_exc
    except JWTError:
        raise cred_exc
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise cred_exc
    return user


@router.post("/register", summary="Create a user")
def register(body: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.username == body.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")

    # ✅ pbkdf2_sha256 supports long passwords
    hashed = pbkdf2_sha256.hash(body.password)
    user = models.User(username=body.username, password=hashed)
    db.add(user)
    db.commit()
    return {"status": "ok"}


@router.post("/login", response_model=schemas.TokenOut, summary="Login and get JWT")
def login(body: schemas.UserCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == body.username).first()
    if not user or not pbkdf2_sha256.verify(body.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token(sub=user.username)
    return {"access_token": token, "token_type": "bearer"}
