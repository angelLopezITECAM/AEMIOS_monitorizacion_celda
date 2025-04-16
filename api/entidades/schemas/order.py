# app/models/point.py

from pydantic import BaseModel
from typing import Dict, Optional
from datetime import datetime

class DataOrder(BaseModel):
    element: str
    action: float
    ud: str

