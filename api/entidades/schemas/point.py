# app/models/point.py

from pydantic import BaseModel
from typing import Dict, Optional
from datetime import datetime

class DataPoint(BaseModel):
    magnitude: str
    value: float
    ud: str

