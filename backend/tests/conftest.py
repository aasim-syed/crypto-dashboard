# backend/tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db

# ⬅️ make sure ALL models are imported so tables exist
# (User, Coin, PricePoint, Favorite, etc.)
from app import models as _models  # noqa: F401  (import side-effect registers models on Base)

@pytest.fixture(scope="function")
def engine():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        future=True,
    )
    # fresh schema per test
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    return engine

@pytest.fixture(scope="function")
def db_session(engine):
    TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()

@pytest.fixture(scope="function")
def client(db_session):
    def _get_test_db():
        try:
            yield db_session
        finally:
            pass
    app.dependency_overrides[get_db] = _get_test_db
    return TestClient(app)

# Optional helper to seed BTC/ETH
@pytest.fixture
def seed_coins(db_session):
    from app import models
    btc = models.Coin(id="bitcoin", name="Bitcoin", symbol="btc", market_cap_rank=1)
    eth = models.Coin(id="ethereum", name="Ethereum", symbol="eth", market_cap_rank=2)
    db_session.add_all([btc, eth])
    db_session.commit()
    return {"btc": btc, "eth": eth}
