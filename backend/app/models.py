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

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")

class Favorite(Base):
    __tablename__ = "favorites"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    coin_id = Column(String(100), nullable=False, index=True)

    user = relationship("User", back_populates="favorites")

    __table_args__ = (UniqueConstraint("user_id", "coin_id", name="uq_user_coin"),)