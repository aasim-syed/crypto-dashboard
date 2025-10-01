import httpx
from datetime import datetime
from dateutil import tz

BASE = "https://api.coingecko.com/api/v3"

async def fetch_top_market(page_size=10):
    # Public, no auth; respects simple usage limits
    params = {
        "vs_currency": "usd",
        "order": "market_cap_desc",
        "per_page": page_size,
        "page": 1,
        "price_change_percentage": "24h"
    }
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get(f"{BASE}/coins/markets", params=params)
        r.raise_for_status()
        return r.json()

async def fetch_history(coin_id: str, days: int = 30):
    params = {"vs_currency": "usd", "days": days, "interval": "daily"}
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get(f"{BASE}/coins/{coin_id}/market_chart", params=params)
        r.raise_for_status()
        data = r.json()
        # data["prices"] is [[ms, price], ...]
        series = []
        for ms, price in data.get("prices", []):
            ts = datetime.fromtimestamp(ms/1000, tz=tz.UTC).replace(tzinfo=None)
            series.append({"ts": ts, "price": float(price)})
        # approximate volumes/mcaps if desired
        vols = {datetime.fromtimestamp(ms/1000, tz=tz.UTC).replace(tzinfo=None): float(v) for ms, v in data.get("total_volumes", [])}
        mcaps = {datetime.fromtimestamp(ms/1000, tz=tz.UTC).replace(tzinfo=None): float(m) for ms, m in data.get("market_caps", [])}
        return series, vols, mcaps
