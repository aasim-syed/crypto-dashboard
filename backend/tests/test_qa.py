# backend/tests/test_qa.py
from datetime import datetime, timedelta
from app import models

def test_qa_price_and_trend(client, db_session, seed_coins):
    now = datetime.utcnow()
    db_session.add_all([
        models.PricePoint(coin_id="bitcoin", ts=now - timedelta(days=2), price=60000.0, volume=0, market_cap=0),
        models.PricePoint(coin_id="bitcoin", ts=now - timedelta(days=1), price=60500.0, volume=0, market_cap=0),
        models.PricePoint(coin_id="bitcoin", ts=now,                     price=61000.0, volume=0, market_cap=0),
    ])
    db_session.commit()

    # price intent
    r = client.post("/qa", json={"query": "What is the price of Bitcoin?"})
    assert r.status_code == 200
    body = r.json()
    assert "price" in body["intent"].lower()
    assert "bitcoin" in body["answer"].lower()

    # trend intent
    r2 = client.post("/qa", json={"query": "Show me the 7-day trend of Bitcoin"})
    assert r2.status_code == 200
    body2 = r2.json()
    assert "trend" in body2["intent"].lower()
    assert isinstance(body2.get("series"), list) and len(body2["series"]) >= 1
