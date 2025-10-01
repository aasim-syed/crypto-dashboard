import os
from datetime import datetime, timedelta
from typing import List

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from cachetools import TTLCache

from .database import Base, engine, SessionLocal
from . import models, schemas
from .ingest import sync_top_and_history
from .qa import handle_query
from .models import PricePoint, Coin

# --- Create FastAPI app ONCE ---
app = FastAPI(title="Crypto Backend", version="1.0.0")

# --- DB tables ---
Base.metadata.create_all(bind=engine)

# --- CORS ---
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://crypto-dashboard-eight-puce.vercel.app/",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- simple cache for /coins list ---
table_cache = TTLCache(maxsize=1, ttl=30)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- import and register routers ---
from . import auth, favorites  # IMPORTANT: after app is created
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(favorites.router, prefix="/favorites", tags=["favorites"])

@app.post("/sync", summary="Fetch top N coins + last 30 days into DB")
async def sync_data(n: int = 10, days: int = 30, db: Session = Depends(get_db)):
    await sync_top_and_history(db, top_n=n, days=days)
    table_cache.clear()
    return {"status": "ok", "synced": n, "days": days}

@app.get("/coins", response_model=List[schemas.CoinRow])
def get_top_coins(limit: int = 10, db: Session = Depends(get_db), sort: str = "market_cap_rank"):
    key = (limit, sort)
    if key in table_cache:
        return table_cache[key]

    coins = db.query(Coin).order_by(Coin.market_cap_rank.asc()).limit(limit).all()
    rows = []
    for c in coins:
        latest = (
            db.query(PricePoint)
            .filter(PricePoint.coin_id == c.id)
            .order_by(PricePoint.ts.desc())
            .first()
        )
        if not latest:
            continue
        prev = (
            db.query(PricePoint)
            .filter(PricePoint.coin_id == c.id, PricePoint.ts <= latest.ts - timedelta(days=1))
            .order_by(PricePoint.ts.desc())
            .first()
        )
        pct = (latest.price - prev.price) / prev.price * 100.0 if prev and prev.price else 0.0
        rows.append({
            "id": c.id,
            "name": c.name,
            "symbol": c.symbol,
            "price": latest.price,
            "volume": latest.volume,
            "market_cap": latest.market_cap,
            "market_cap_rank": c.market_cap_rank,
            "pct_change_24h": pct,
        })

    if sort in {"price", "volume", "market_cap", "pct_change_24h"}:
        rows.sort(key=lambda r: r[sort], reverse=True)
    elif sort == "name":
        rows.sort(key=lambda r: r["name"].lower())
    else:
        rows.sort(key=lambda r: r["market_cap_rank"])

    table_cache[key] = rows
    return rows

@app.get("/coins/{coin_id}/history", response_model=schemas.HistoryOut)
def get_history(coin_id: str, days: int = 30, db: Session = Depends(get_db)):
    since = datetime.utcnow() - timedelta(days=days)
    series = (
        db.query(PricePoint)
        .filter(PricePoint.coin_id == coin_id, PricePoint.ts >= since)
        .order_by(PricePoint.ts.asc())
        .all()
    )
    return {"coin_id": coin_id, "series": [{"ts": p.ts, "price": p.price} for p in series]}

@app.post("/qa", response_model=schemas.QAResponse)
def qa(req: schemas.QARequest, db: Session = Depends(get_db)):
    return handle_query(db, req.query)
