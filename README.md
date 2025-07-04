# 🧠 Smart Task Tracker

A mini full-stack productivity application built with **React** (frontend) and **FastAPI** (backend), enabling users to manage daily tasks with features like task categorization, drag-and-drop sorting, user authentication, and optional AI assistance.

---

## 🔧 Tech Stack

| Layer     | Technology             |
|-----------|------------------------|
| Frontend  | React, React Router    |
| Backend   | FastAPI (Python)       |
| Database  | SQLite (via SQLAlchemy)|
| Styling   | CSS (basic UI)         |
| Deployment| Vercel (Frontend), Railway (Backend) |

---

## ✨ Features

- ✅ **User Authentication**
  - Register / Login functionality using FastAPI
- ✅ **Task Management**
  - Add, delete, update tasks with title, description, and category
- ✅ **Mark Complete**
  - Toggle tasks as complete/incomplete
- ✅ **Drag and Drop Sorting**
  - Rearrange tasks visually (using `@hello-pangea/dnd`)
- ✅ **Optional AI Features**
  - Suggest task priority based on title
  - Detect duplicate task titles
- ✅ **Responsive UI**
  - Simple and clean layout for usability
## 🚀 Live Demo
https://smart-task-tracker-iq9p.vercel.app/


## 🛠️ Setup Steps (Full Stack)

🔹 1. Clone the repository


git clone https://github.com/AntonyPaul1963/SmartTaskTracker.git
cd SmartTaskTracker



🔹 2. Backend Setup (FastAPI)

cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn main:app --reload




🔹 3. Frontend Setup (React)
Open a new terminal:


cd frontend
npm install
npm start  
