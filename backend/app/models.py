from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from .database import Base

class Coin(Base):
    __tablename__ = "coins"
    id = Column(String, primary_key=True)         # coingecko id (e.g., "bitcoin")
    symbol = Column(String, index=True)           # btc
    name = Column(String, index=True)             # Bitcoin
    market_cap_rank = Column(Integer, index=True)

    prices = relationship("PricePoint", back_populates="coin", cascade="all, delete-orphan")

class PricePoint(Base):
    __tablename__ = "price_points"
    id = Column(Integer, primary_key=True, autoincrement=True)
    coin_id = Column(String, ForeignKey("coins.id"), index=True)
    ts = Column(DateTime, index=True)
    price = Column(Float)
    volume = Column(Float, default=0.0)
    market_cap = Column(Float, default=0.0)

    coin = relationship("Coin", back_populates="prices")
    __table_args__ = (UniqueConstraint("coin_id", "ts", name="uq_price_point_coin_ts"),)
