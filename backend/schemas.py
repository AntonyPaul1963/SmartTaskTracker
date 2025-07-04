from pydantic import BaseModel
from typing import Optional

# ----------------------
# 🧾 AUTH SCHEMAS
# ----------------------

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

# ----------------------
# ✅ TASK SCHEMAS
# ----------------------

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    category: Optional[str] = ""
    position: Optional[int] = 0
    completed: Optional[bool] = False

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    completed: Optional[bool] = None
    position: Optional[int] = None

# ----------------------
# 🧾 RESPONSE SCHEMA
# ----------------------

class TaskOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    category: Optional[str]
    completed: bool
    position: Optional[int]

    class Config:
        orm_mode = True