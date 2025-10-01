import re
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from .models import Coin, PricePoint
from .utils import norm

_PRICE_PAT = re.compile(r"(price|rate)\s+of\s+([a-z0-9 \-]+)", re.I)
_TREND_PAT = re.compile(r"(trend|chart|graph).*(\d+)\s*[- ]*day.*\s+of\s+([a-z0-9 \-]+)", re.I)
_SIMPLE_SYMBOL = re.compile(r"^([a-z0-9]{2,10})$", re.I)

def resolve_coin(db: Session, token: str) -> Coin | None:
    key = norm(token)
    # try id, name, symbol
    coin = db.query(Coin).filter(Coin.id == token).first()
    if coin: return coin
    coin = db.query(Coin).filter(Coin.symbol.ilike(token)).first()
    if coin: return coin
    coin = db.query(Coin).filter(Coin.name.ilike(f"%{token}%")).order_by(Coin.market_cap_rank.asc()).first()
    return coin

def current_row(db: Session, coin: Coin):
    # latest point
    pp = db.query(PricePoint).filter(PricePoint.coin_id == coin.id).order_by(PricePoint.ts.desc()).first()
    if not pp: return None
    # compute 24h change if points exist
    prev = db.query(PricePoint).filter(PricePoint.coin_id == coin.id, PricePoint.ts <= pp.ts - timedelta(days=1)).order_by(PricePoint.ts.desc()).first()
    pct = 0.0
    if prev and prev.price:
        pct = (pp.price - prev.price) / prev.price * 100.0
    return {"price": pp.price, "ts": pp.ts, "pct_change_24h": pct}

def handle_query(db: Session, query: str):
    q = query.strip()

    m = _PRICE_PAT.search(q)
    if m:
        coin_tok = m.group(2).strip()
        coin = resolve_coin(db, coin_tok)
        if not coin:
            return {"intent": "price_lookup", "answer": f"Sorry, I couldn't find '{coin_tok}'. Try the coin name or symbol.", "coin_id": None}
        row = current_row(db, coin)
        if not row:
            return {"intent": "price_lookup", "answer": f"I don't have data for {coin.name} yet. Hit /sync first.", "coin_id": coin.id}
        return {
            "intent": "price_lookup",
            "coin_id": coin.id,
            "answer": f"{coin.name} ({coin.symbol.upper()}) is ${row['price']:.2f} (24h {row['pct_change_24h']:+.2f}%).",
            "extra": {"ts": row["ts"].isoformat()}
        }

    m = _TREND_PAT.search(q)
    if m:
        days = int(m.group(2))
        coin_tok = m.group(3).strip()
        coin = resolve_coin(db, coin_tok)
        if not coin:
            return {"intent": "trend_lookup", "answer": f"Unknown coin '{coin_tok}'.", "coin_id": None}
        since = datetime.utcnow() - timedelta(days=days)
        series = db.query(PricePoint).filter(PricePoint.coin_id == coin.id, PricePoint.ts >= since).order_by(PricePoint.ts.asc()).all()
        if not series:
            return {"intent": "trend_lookup", "answer": f"No data for last {days} days for {coin.name}.", "coin_id": coin.id}
        return {
            "intent": "trend_lookup",
            "coin_id": coin.id,
            "answer": f"Showing {days}-day trend for {coin.name}.",
            "extra": {
                "series": [{"ts": p.ts.isoformat(), "price": p.price} for p in series]
            }
        }

    # simple "BTC" price
    if _SIMPLE_SYMBOL.match(q):
        coin = resolve_coin(db, q)
        if coin:
            row = current_row(db, coin)
            if row:
                return {
                    "intent": "price_lookup",
                    "coin_id": coin.id,
                    "answer": f"{coin.name} ({coin.symbol.upper()}) is ${row['price']:.2f} (24h {row['pct_change_24h']:+.2f}%).",
                    "extra": {"ts": row["ts"].isoformat()}
                }

    return {"intent": "fallback", "answer": "Try queries like: 'What is the price of Bitcoin?' or 'Show me the 7-day trend of Ethereum.'"}
