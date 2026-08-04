from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session
import jwt
from database import get_db
import models

from config import SECRET_KEY, ALGORITHM

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Unauthorized")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

def get_current_super_admin(current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.RoleEnum.SUPER_USER:
        raise HTTPException(status_code=403, detail="Super Admin access required")
    return current_user
