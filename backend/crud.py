from sqlalchemy.orm import Session
from models_db import User, Task
from auth import hash_password

def create_user(db: Session, username: str, password: str):
    user = User(username=username, hashed_password=hash_password(password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_task(db: Session, user_id: int, task_data):
    task = Task(**task_data.dict(), user_id=user_id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def get_tasks(db: Session, user_id: int):
    return db.query(Task).filter(Task.user_id == user_id).order_by(Task.position).all()