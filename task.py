from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# --------------------
# CREATE TASK
# --------------------
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "Medium"   # Low / Medium / High
    due_date: Optional[datetime] = None


# --------------------
# UPDATE TASK
# --------------------
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None


# --------------------
# STATUS UPDATE
# --------------------
class TaskStatusUpdate(BaseModel):
    status: str   # Pending / In Progress / Completed