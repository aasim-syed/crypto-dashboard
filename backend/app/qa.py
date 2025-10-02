# backend/app/qa.py
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from .models import PricePoint

def handle_query(db: Session, query: str):
    q = (query or "").lower().strip()

    # intent: price
    if "price" in q:
        # naive coin detection: first known coin id present in query
        # (replace with your own mapping if available)
        coin = "bitcoin" if "bitcoin" in q or "btc" in q else None
        if coin:
            latest = (
                db.query(PricePoint)
                  .filter(PricePoint.coin_id == coin)
                  .order_by(PricePoint.ts.desc())
                  .first()
            )
            if latest:
                return {
                    "intent": "price",
                    "answer": f"The latest {coin} price is ${latest.price:,.2f}."
                }
        return {"intent": "price", "answer": "Sorry, I couldn't find that coin."}

    # intent: trend
    if any(k in q for k in ["trend", "7-day", "7 day", "history", "last 7"]):
        coin = "bitcoin" if "bitcoin" in q or "btc" in q else None
        days = 7 if "7" in q else 30
        if coin:
            since = datetime.utcnow() - timedelta(days=days)
            points = (
                db.query(PricePoint)
                  .filter(PricePoint.coin_id == coin, PricePoint.ts >= since)
                  .order_by(PricePoint.ts.asc())
                  .all()
            )
            series = [{"ts": p.ts.isoformat(), "price": p.price} for p in points]
            return {
                "intent": "trend",
                "answer": f"Showing {days}-day trend for {coin}.",
                "series": series
            }
        return {"intent": "trend", "answer": "Sorry, I couldn't find that coin.", "series": []}

    # fallback
    return {"intent": "fallback", "answer": "Sorry, I didn’t understand that. Try 'price of Bitcoin' or '7-day trend of Ethereum'."}
