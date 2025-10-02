# backend/app/ingest.py
from sqlalchemy.orm import Session
from .models import Coin, PricePoint
from .coingecko import fetch_top_market, fetch_history
from datetime import datetime

def _parse_series(pairs):
    """Normalize CoinGecko-style [[ms, val], ...] into (datetime, float)."""
    out = []
    for item in pairs or []:
        if isinstance(item, (list, tuple)) and len(item) >= 2:
            ts_ms, val = item
            ts = datetime.utcfromtimestamp(ts_ms / 1000.0)
            out.append((ts, float(val)))
    return out

def sync_top_and_history(db: Session, n: int = 10, days: int = 30):
    """
    Fetch top N coins from CoinGecko and store with historical prices.
    """
    top = fetch_top_market(n=n)
    for coin in top:
        cid = coin["id"]
        c = (
            db.query(Coin)
            .filter(Coin.id == cid)
            .one_or_none()
        )
        if not c:
            c = Coin(
                id=cid,
                name=coin["name"],
                symbol=coin["symbol"],
                market_cap_rank=coin["market_cap_rank"],
            )
            db.add(c)
            db.commit()

        prices, volumes, mcaps = fetch_history(cid, days=days)
        price_pairs = _parse_series(prices)
        vol_pairs   = _parse_series(volumes)
        mc_pairs    = _parse_series(mcaps)

        for (ts, price), (_, vol), (_, mc) in zip(price_pairs, vol_pairs, mc_pairs):
            exists = (
                db.query(PricePoint)
                  .filter(PricePoint.coin_id == cid, PricePoint.ts == ts)
                  .first()
            )
            if not exists:
                db.add(PricePoint(
                    coin_id=cid,
                    ts=ts,
                    price=price,
                    volume=vol,
                    market_cap=mc,
                ))
        db.commit()

    return {"status": "ok", "count": len(top)}
