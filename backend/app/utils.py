import re

def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", s.lower())
