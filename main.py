from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers
from routes import auth, project



app = FastAPI(
    title="Task Management API",
    description="Full Stack Task Management App using FastAPI + MongoDB",
    version="1.0.0"
)

# ✅ CORS (for React frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # later replace with React URL like http://localhost:5173
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Root endpoint
@app.get("/")
def root():
    return {
        "message": "Task Management API is running 🚀"
    }

# ✅ Include routers
app.include_router(auth.router)
app.include_router(project.router)

from routes import task

app.include_router(task.router)