# auth.py
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Dict

SECRET_KEY = "SECRET_KEY"  
ALGORITHM = "Algorithm" 
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day

# In-memory blacklist store (for testing only)
blacklisted_tokens: Dict[str, datetime] = {}

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if is_token_blacklisted(token):
            return None
        return payload
    except JWTError:
        return None

def delete_access_token(token: str):
    blacklist_token(token)
    return {"message": "Token has been invalidated"}

def blacklist_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        exp = payload.get("exp")
        if exp:
            expiry_time = datetime.utcfromtimestamp(exp)
            blacklisted_tokens[token] = expiry_time
    except JWTError:
        pass  # Token is invalid, ignore

def is_token_blacklisted(token: str) -> bool:
    expiry = blacklisted_tokens.get(token)
    if not expiry:
        return False
    if datetime.utcnow() >= expiry:
        del blacklisted_tokens[token]
        return False
    return True
