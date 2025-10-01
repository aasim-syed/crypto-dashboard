from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class CoinOut(BaseModel):
    id: str
    symbol: str
    name: str
    market_cap_rank: int

class CoinRow(BaseModel):
    id: str
    name: str
    symbol: str
    price: float
    volume: float
    market_cap: float
    market_cap_rank: int
    pct_change_24h: float

class PricePointOut(BaseModel):
    ts: datetime
    price: float

class HistoryOut(BaseModel):
    coin_id: str
    series: List[PricePointOut]

class QARequest(BaseModel):
    query: str

class QAResponse(BaseModel):
    answer: str
    intent: str
    coin_id: Optional[str] = None
    extra: Optional[dict] = None
