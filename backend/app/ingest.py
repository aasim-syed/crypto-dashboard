from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from . import models
from .coingecko import fetch_top_market, fetch_history

async def sync_top_and_history(db: Session, top_n: int = 10, days: int = 30):
    top = await fetch_top_market(top_n)
    ids = []
    for c in top:
        coin = db.get(models.Coin, c["id"])
        if not coin:
            coin = models.Coin(id=c["id"], symbol=c["symbol"], name=c["name"], market_cap_rank=c.get("market_cap_rank") or 10**9)
            db.add(coin)
        else:
            coin.symbol = c["symbol"]
            coin.name = c["name"]
            coin.market_cap_rank = c.get("market_cap_rank") or coin.market_cap_rank
        ids.append(c["id"])
    db.commit()

    # history
    for coin_id in ids:
        series, vols, mcaps = await fetch_history(coin_id, days=days)
        # upsert points
        for pt in series:
            ts = pt["ts"]
            existing = db.query(models.PricePoint).filter_by(coin_id=coin_id, ts=ts).first()
            if not existing:
                db.add(models.PricePoint(
                    coin_id=coin_id,
                    ts=ts,
                    price=pt["price"],
                    volume=vols.get(ts, 0.0),
                    market_cap=mcaps.get(ts, 0.0),
                ))
        db.commit()
