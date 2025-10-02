# backend/tests/test_history.py
from datetime import datetime, timedelta
from app import models

def test_history_endpoint(client, db_session, seed_coins):
    now = datetime.utcnow()
    db_session.add_all([
        models.PricePoint(coin_id="ethereum", ts=now - timedelta(days=2), price=3000.0, volume=0, market_cap=0),
        models.PricePoint(coin_id="ethereum", ts=now - timedelta(days=1), price=3050.0, volume=0, market_cap=0),
    ])
    db_session.commit()

    r = client.get("/coins/ethereum/history?days=7")
    assert r.status_code == 200
    payload = r.json()
    assert payload["coin_id"] == "ethereum"
    assert len(payload["series"]) >= 2
    assert "price" in payload["series"][0]
