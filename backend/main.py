from fastapi import FastAPI, Depends, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import SessionLocal, engine
import models_db
import crud, schemas, auth, ai

# --- FastAPI App Setup ---
app = FastAPI()

# --- CORS Middleware (Allow frontend) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Create DB Tables ---
models_db.Base.metadata.create_all(bind=engine)

# --- DB Dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------------------
# 📌 AUTH ROUTES
# -------------------------------

@app.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    return crud.create_user(db, user.username, user.password)

@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user.username)
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = auth.create_token({"sub": user.username})
    return {"access_token": token}

# -------------------------------
# 📌 TASK ROUTES
# -------------------------------

@app.post("/tasks", response_model=schemas.TaskOut)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    return crud.create_task(db, user_id=1, task_data=task)  # Mocked user_id

@app.get("/tasks", response_model=List[schemas.TaskOut])
def get_tasks(db: Session = Depends(get_db)):
    return crud.get_tasks(db, user_id=1)  # Mocked user_id

@app.put("/tasks/{task_id}", response_model=schemas.TaskOut)
def update_task(task_id: int, updated: schemas.TaskUpdate, db: Session = Depends(get_db)):
    print("UPDATE BODY:", updated)  # 👈 Debug line
    task = db.query(models_db.Task).filter(models_db.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in updated.dict(exclude_unset=True).items():
        setattr(task, key, value)
    db.commit()
    db.refresh(task)
    return task


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models_db.Task).filter(models_db.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"detail": "Task deleted"}

# -------------------------------
# 📌 AI ROUTES
# -------------------------------

@app.post("/ai/priority")
def get_priority(title: str):
    return {"priority": ai.suggest_priority(title)}

@app.post("/ai/duplicate")
def check_duplicate(title: str, db: Session = Depends(get_db)):
    tasks = crud.get_tasks(db, user_id=1)
    titles = [t.title for t in tasks]
    return {"is_duplicate": ai.is_duplicate(title, titles)}
