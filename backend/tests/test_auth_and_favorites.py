# backend/tests/test_auth_and_favorites.py
def auth_headers(token: str):
    return {"Authorization": f"Bearer {token}"}

def test_register_login_and_favorites(client, seed_coins):
    # register
    r = client.post("/auth/register", json={"username": "alice", "password": "pass123"})
    assert r.status_code == 200

    # login
    r2 = client.post("/auth/login", json={"username": "alice", "password": "pass123"})
    assert r2.status_code == 200
    token = r2.json()["access_token"]
    assert token

    # add favorite
    r3 = client.post("/favorites/bitcoin", headers=auth_headers(token))
    assert r3.status_code == 200

    # list favorites
    r4 = client.get("/favorites", headers=auth_headers(token))
    assert r4.status_code == 200
    favs = r4.json()
    assert len(favs) == 1 and favs[0]["coin_id"] == "bitcoin"

    # remove favorite
    r5 = client.delete("/favorites/bitcoin", headers=auth_headers(token))
    assert r5.status_code == 200

    # list again
    r6 = client.get("/favorites", headers=auth_headers(token))
    assert r6.status_code == 200
    assert r6.json() == []
