# backend/tests/test_sync_and_coins.py
from unittest.mock import patch
from datetime import datetime, timedelta

def fake_fetch_top_market(n=10):
    return [
        {"id": "bitcoin", "name": "Bitcoin", "symbol": "btc", "market_cap_rank": 1},
        {"id": "ethereum", "name": "Ethereum", "symbol": "eth", "market_cap_rank": 2},
    ][:n]

def fake_fetch_history(coin_id: str, days: int = 30):
    # Return CoinGecko-like shapes: list of [timestamp_ms, value]
    now = datetime.utcnow()
    ms = lambda dt: int(dt.timestamp() * 1000)
    points = [
        (now - timedelta(days=2), 60000.0, 1_000_000_000, 1_100_000_000_000),
        (now - timedelta(days=1), 60500.0, 1_100_000_000, 1_120_000_000_000),
        (now,                     61000.0, 1_200_000_000, 1_140_000_000_000),
    ]
    prices = [[ms(t), p] for (t, p, v, m) in points]
    vols   = [[ms(t), v] for (t, p, v, m) in points]
    mcaps  = [[ms(t), m] for (t, p, v, m) in points]
    return prices, vols, mcaps

@patch("app.ingest.fetch_top_market", side_effect=lambda n=10: fake_fetch_top_market(n))
@patch("app.ingest.fetch_history", side_effect=lambda coin_id, days=30: fake_fetch_history(coin_id, days))
def test_sync_and_coins(mock_hist, mock_top, client):
    # sync top + history
    r = client.post("/sync?n=2&days=3")
    assert r.status_code == 200
    payload = r.json()
    assert payload["status"] == "ok"

    # fetch coins table
    r2 = client.get("/coins?limit=2&sort=market_cap_rank")
    assert r2.status_code == 200
    data = r2.json()
    assert isinstance(data, list) and len(data) == 2

    first = data[0]
    for k in ["id", "name", "symbol", "price", "volume", "market_cap", "market_cap_rank", "pct_change_24h"]:
        assert k in first
